import os, re
DIR = "/Users/javiperezz7/.gemini/antigravity/scratch/adsense-sites/insurancecostguide/"

NEW_LOGO = """<a href="/" class="site-logo" style="display:flex;align-items:center; gap:8px;text-decoration:none;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32" style="flex-shrink:0;">
    <defs>
      <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1d4ed8"/>
        <stop offset="100%" style="stop-color:#2563EB"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#hbg)"/>
    <path d="M50 12 L76 22 L76 50 C76 65 64 77 50 84 C36 77 24 65 24 50 L24 22 Z" fill="white" opacity="0.95"/>
    <polyline points="39,51 47,59 63,42" stroke="#2563EB" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>
  <span style="font-weight:700;color:#1E3A5F;font-size:1.1rem;">
    Insurance<span style="color:#2563EB;">CostGuides</span>
  </span>
</a>"""

for root, _, files in os.walk(DIR):
    for filename in files:
        if filename.endswith(".html"):
            path = os.path.join(root, filename)
            with open(path, "r") as f: content = f.read()
            orig_content = content
            content = content.replace('href="/index"', 'href="/"')
            content = content.replace("href='/index'", "href='/'")
            content = content.replace('href="/index.html"', 'href="/"')
            content = content.replace('href="https://insurancecostguides.com/index"', 'href="/"')
            content = re.sub(r'<a[^>]*class="site-logo"[^>]*>.*?</a>', NEW_LOGO, content, flags=re.DOTALL|re.IGNORECASE)
            def repl_href(m):
                link = m.group(1)
                if ":" not in link or link.startswith("https://insurancecostguides.com/"):
                    if link.endswith(".html"): link = link[:-5]
                return f'href="{link}"'
            content = re.sub(r'href="([^"]+)"', repl_href, content)
            if "ca-pub-3733223915347669" not in content:
                content = content.replace("</head>", '\n<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3733223915347669"></script>\n</head>')
            if "favicon.svg" not in content:
                content = content.replace("</head>", '\n<link href="/favicon.svg" rel="icon" type="image/svg+xml"/>\n</head>')
            content = content.replace('content="noindex"', 'content="index, follow"')
            content = content.replace('content="noindex, nofollow"', 'content="index, follow"')
            if content != orig_content:
                with open(path, "w") as f: f.write(content)

p = os.path.join(DIR, "sitemap.xml")
if os.path.exists(p):
    with open(p, "r") as f: sm = f.read()
    sm = sm.replace('.html</loc>', '</loc>').replace('/index</loc>', '/</loc>')
    with open(p, "w") as f: f.write(sm)

with open(os.path.join(DIR, "ads.txt"), "w") as f: f.write("google.com, pub-3733223915347669, DIRECT, f08c47fec0942fa0\n")
