/* ============================================================
   InsuranceCostGuide — main.js
   Mobile nav, FAQ accordion, TOC, cookie consent, schemas,
   calculators. ZERO static JSON-LD in HTML.
   ============================================================ */
(function () {
  'use strict';

  var DOMAIN = 'https://insurancecostguides.com';

  /* ========== Inject JSON-LD (no duplicates) ========== */
  function injectSchema(obj) {
    var existing = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < existing.length; i++) {
      try {
        var parsed = JSON.parse(existing[i].textContent);
        if (parsed['@type'] === obj['@type']) return;
      } catch (e) { /* skip */ }
    }
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  /* ========== Mobile Nav Toggle ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.mobile-nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  });

  /* ========== Header scroll shadow ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  });

  /* ========== FAQ Accordion ========== */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        item.closest('.faq-section').querySelectorAll('.faq-item').forEach(function (o) {
          o.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    });
  });

  /* ========== Table of Contents (auto) ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    var article = document.querySelector('.article-content');
    if (!article) return;
    var headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) { toc.style.display = 'none'; return; }

    var list = document.createElement('ol');
    headings.forEach(function (h, idx) {
      if (!h.id) h.id = 'section-' + (idx + 1);
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;

      if (h.tagName === 'H3') {
        var parent = list.lastElementChild;
        if (parent) {
          var sub = parent.querySelector('.toc-sub');
          if (!sub) {
            sub = document.createElement('ol');
            sub.classList.add('toc-sub');
            parent.appendChild(sub);
          }
          var subLi = document.createElement('li');
          subLi.appendChild(a);
          sub.appendChild(subLi);
        }
      } else {
        var li = document.createElement('li');
        li.appendChild(a);
        list.appendChild(li);
      }
    });

    var title = toc.querySelector('.toc-title');
    if (title) title.insertAdjacentElement('afterend', list);
    else toc.appendChild(list);
  });

  /* ========== Smooth Scroll ========== */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var id = anchor.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ========== Cookie Consent ========== */
  document.addEventListener('DOMContentLoaded', function () {
    if (getCookie('icg_consent')) return;
    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML =
      '<p>We use cookies for analytics and to improve your experience. Read our <a href="' + DOMAIN + '/privacy-policy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-buttons">' +
      '<button class="cookie-btn cookie-btn-reject" id="cookie-reject">Reject Non-Essential</button>' +
      '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', function () {
      setCookie('icg_consent', 'accepted', 365);
      banner.remove();
    });
    document.getElementById('cookie-reject').addEventListener('click', function () {
      setCookie('icg_consent', 'rejected', 365);
      banner.remove();
    });
  });

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie(name) {
    var v = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)');
    return v ? v[2] : null;
  }

  /* ========== Schema: BreadcrumbList ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var bc = document.querySelector('.breadcrumb[data-schema="true"]');
    if (!bc) return;
    var items = bc.querySelectorAll('li');
    var list = [];
    items.forEach(function (item, idx) {
      var link = item.querySelector('a');
      var entry = {
        '@type': 'ListItem',
        'position': idx + 1,
        'name': (link ? link.textContent : item.textContent).trim()
      };
      if (link) entry.item = link.href;
      list.push(entry);
    });
    if (list.length > 0) {
      injectSchema({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': list
      });
    }
  });

  /* ========== Schema: FAQPage ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.faq-section[data-schema="true"]');
    if (!section) return;
    var entries = [];
    section.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-question');
      var a = item.querySelector('.faq-answer');
      if (q && a) {
        entries.push({
          '@type': 'Question',
          'name': q.textContent.trim(),
          'acceptedAnswer': { '@type': 'Answer', 'text': a.textContent.trim() }
        });
      }
    });
    if (entries.length > 0) {
      injectSchema({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': entries
      });
    }
  });

  /* ========== Schema: Article ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('[data-schema="article"]');
    if (!el) return;
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': el.getAttribute('data-title') || document.title,
      'description': el.getAttribute('data-description') || '',
      'url': el.getAttribute('data-url') || window.location.href,
      'datePublished': el.getAttribute('data-published') || '',
      'dateModified': el.getAttribute('data-modified') || el.getAttribute('data-published') || '',
      'author': { '@type': 'Person', 'name': 'Michael Torres' },
      'publisher': { '@type': 'Organization', 'name': 'InsuranceCostGuide', 'url': DOMAIN }
    });
  });

  /* ========== Schema: WebApplication (calculators) ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('[data-schema="webapp"]');
    if (!el) return;
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': el.getAttribute('data-title') || document.title,
      'description': el.getAttribute('data-description') || '',
      'url': el.getAttribute('data-url') || window.location.href,
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Any',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' }
    });
  });

  /* ========== Schema: WebSite + Organization (home only) ========== */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.getAttribute('data-page') !== 'home') return;
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'InsuranceCostGuide',
      'url': DOMAIN,
      'description': 'Your trusted guide to understanding insurance costs in the United States.',
      'publisher': { '@type': 'Organization', 'name': 'InsuranceCostGuide', 'url': DOMAIN }
    });
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'InsuranceCostGuide',
      'url': DOMAIN,
      'description': 'Educational insurance cost guides and tools for US consumers.',
      'address': { '@type': 'PostalAddress', 'addressCountry': 'US' }
    });
  });

  /* ========== Health Insurance Calculator ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('health-calc-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var age = parseInt(document.getElementById('health-age').value) || 35;
      var stateGroup = document.getElementById('health-state').value;
      var tier = document.getElementById('health-tier').value;
      var coverageType = document.getElementById('health-coverage').value;
      var tobacco = document.getElementById('health-tobacco').value;

      var basePremiums = { 'bronze': 360, 'silver': 456, 'gold': 600, 'platinum': 740 };
      var stateMultipliers = { 'avg': 1.0, 'low': 0.80, 'medium': 0.95, 'high': 1.15, 'highest': 1.38 };

      var ageFactor = 1.0;
      if (age < 21) ageFactor = 0.635;
      else if (age <= 24) ageFactor = 0.635 + (age - 20) * 0.02;
      else if (age <= 34) ageFactor = 0.72 + (age - 24) * 0.028;
      else if (age <= 44) ageFactor = 1.0 + (age - 34) * 0.035;
      else if (age <= 54) ageFactor = 1.35 + (age - 44) * 0.045;
      else ageFactor = 1.80 + (age - 54) * 0.055;
      if (ageFactor > 3.0) ageFactor = 3.0;

      var coverageMultipliers = { 'individual': 1.0, 'couple': 2.0, 'family': 2.7 };
      var tobaccoFactor = (tobacco === 'yes') ? 1.50 : 1.0;

      var monthlyPerPerson = Math.round(basePremiums[tier] * ageFactor * (stateMultipliers[stateGroup] || 1) * tobaccoFactor);
      var monthly = Math.round(monthlyPerPerson * (coverageMultipliers[coverageType] || 1));
      var annual = monthly * 12;

      var deductibles = { 'bronze': 7200, 'silver': 4800, 'gold': 1600, 'platinum': 250 };
      var oopMaxes = { 'bronze': 9200, 'silver': 8550, 'gold': 8550, 'platinum': 4000 };

      document.getElementById('health-monthly').textContent = '$' + monthly.toLocaleString();
      document.getElementById('health-annual').textContent = '$' + annual.toLocaleString();
      document.getElementById('health-deductible').textContent = '$' + (deductibles[tier] || 4800).toLocaleString();
      document.getElementById('health-oop').textContent = '$' + (oopMaxes[tier] || 8550).toLocaleString();

      var tierNames = { 'bronze': 'Bronze', 'silver': 'Silver', 'gold': 'Gold', 'platinum': 'Platinum' };
      var coverageNames = { 'individual': 'individual', 'couple': 'couple', 'family': 'family' };
      document.getElementById('health-summary').innerHTML =
        '<strong>Summary:</strong> Based on your profile (age ' + age + ', ' + tierNames[tier] +
        ' plan, ' + coverageNames[coverageType] + ' coverage), your estimated monthly premium is <strong>$' +
        monthly.toLocaleString() + '</strong> before subsidies. ' +
        (tobacco === 'yes' ? 'Tobacco surcharge adds ~50%. Quitting could save $' + Math.round(monthly - monthly / 1.5).toLocaleString() + '/mo. ' : '') +
        'Visit HealthCare.gov for actual plans and pricing in your area.';

      document.getElementById('health-results').style.display = 'block';
      document.getElementById('health-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ========== Car Insurance Calculator ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('car-calc-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var age = parseInt(document.getElementById('car-age').value) || 35;
      var stateGroup = document.getElementById('car-state').value;
      var coverageLevel = document.getElementById('car-coverage').value;
      var record = document.getElementById('car-record').value;
      var credit = document.getElementById('car-credit').value;
      var vehicle = document.getElementById('car-vehicle').value;

      var basePremiums = { 'minimum': 650, 'full': 1935 };
      var stateMultipliers = { 'avg': 1.0, 'low': 0.72, 'medium': 0.88, 'high': 1.15, 'highest': 1.45 };

      var ageFactor = 1.0;
      if (age < 18) ageFactor = 2.20;
      else if (age < 20) ageFactor = 1.80;
      else if (age < 25) ageFactor = 1.50;
      else if (age < 30) ageFactor = 1.10;
      else if (age < 65) ageFactor = 1.00;
      else if (age < 75) ageFactor = 1.10;
      else ageFactor = 1.25;

      var recordFactors = { 'clean': 1.0, 'minor': 1.25, 'accident': 1.50, 'dui': 2.20 };
      var creditFactors = { 'excellent': 0.85, 'good': 1.0, 'fair': 1.25, 'poor': 1.65 };
      var vehicleFactors = { 'sedan': 1.0, 'suv': 1.10, 'truck': 1.05, 'sports': 1.35, 'economy': 0.90 };

      var annual = Math.round(
        (basePremiums[coverageLevel] || 1935) * ageFactor *
        (stateMultipliers[stateGroup] || 1) *
        (recordFactors[record] || 1) *
        (creditFactors[credit] || 1) *
        (vehicleFactors[vehicle] || 1)
      );
      var monthly = Math.round(annual / 12);
      var sixMonth = Math.round(annual / 2);

      document.getElementById('car-monthly').textContent = '$' + monthly.toLocaleString();
      document.getElementById('car-annual').textContent = '$' + annual.toLocaleString();
      document.getElementById('car-six-month').textContent = '$' + sixMonth.toLocaleString();

      var coverageNames = { 'minimum': 'state minimum liability', 'full': 'full coverage (100/300/100)' };
      var recordNames = { 'clean': 'clean record', 'minor': 'minor violation', 'accident': 'at-fault accident', 'dui': 'DUI on record' };
      document.getElementById('car-summary').innerHTML =
        '<strong>Summary:</strong> Based on your profile (age ' + age + ', ' + coverageNames[coverageLevel] +
        ', ' + recordNames[record] + '), your estimated annual premium is <strong>$' +
        annual.toLocaleString() + '</strong> ($' + monthly.toLocaleString() + '/month). ' +
        (record !== 'clean' ? 'A clean record for 3-5 years could save ~$' + Math.round(annual - annual / (recordFactors[record] || 1)).toLocaleString() + '/yr. ' : '') +
        (credit === 'poor' || credit === 'fair' ? 'Improving your credit could significantly reduce your premium. ' : '') +
        'Get quotes from at least 3-5 insurers for the best rate.';

      document.getElementById('car-results').style.display = 'block';
      document.getElementById('car-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
