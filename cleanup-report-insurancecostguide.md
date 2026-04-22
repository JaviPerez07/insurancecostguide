# Cleanup Report — insurancecostguide

1. **Autor ficticio eliminado**
- Nombre detectado: editor nominal legado con iniciales `M.T.`.
- Credenciales inventadas detectadas: `Insurance Research Editor`, `11 years experience`, `Licensed insurance analyst`.
- Dónde aparecía: `about.html`, `main.js`, y bloques editoriales repartidos por `pages/*.html`.
- Archivos modificados (total de la pasada): 69.
- Bloques sustituidos por `editorial-block`: 65.
- Notas editoriales normalizadas: 64.
- Cambio de schema relacionado: se eliminó la propiedad `author` de los JSON-LD de artículos y del inyector dinámico en `main.js`.

2. **Email legado de contacto**
- Ocurrencias pre-limpieza: 10.
- Archivos modificados por este punto: 4 (`about.html`, `contact.html`, `index.html`, `privacy-policy.html`).
- Estado de la página Contact: muestra `javiperezguides@gmail.com` en texto visible.
- Schema JSON-LD: se retiró la propiedad `email` de la entidad Organization/contactPoint según la interpretación conservadora de los bullets técnicos.
- Grep final en source del email legado: 0.
- Grep final en output: no existen directorios separados `dist/`, `public/` ni `build/`; el sitio publicado es HTML estático en raíz + `pages/`.

3. **Teléfono ficticio**
- Detectado: NO.
- Ocurrencias: 0.

4. **Frases señaladoras**
- Coincidencias exactas encontradas de la lista objetivo: 0.
- Ajuste adyacente realizado: se reemplazó la trust-line de home que atribuía la autoría a una persona individual por un mensaje editorial genérico.
- Bloques completos eliminados de home: 0 detectados para la lista exacta solicitada.

5. **Social links**
- Cantidad de enlaces sociales rotos eliminados: 0.
- Resultado de auditoría: no se detectaron iconos/enlaces sociales con `href="#"`, `href=""` o URLs sociales inválidas en el source actual.

6. **Metas plantilla (detección)**
- Cantidad de metas analizadas: 71.
- Frases explícitas pedidas para grep: 0 coincidencias exactas.
- Patrones literales repetidos detectables en 3+ metas:
  - `insurance cost in 2026` -> 19 metas.
  - `average monthly and annual premiums` -> 3 metas.
  - `average costs by state` -> 3 metas.
- Generado desde: no hay generador versionado en el repo; los patrones están embebidos directamente en los HTML.

7. **Datos desactualizados (muestra)**
- `pages/dental-insurance-cost.html:103` -> referencia a `2025-2026 shopping patterns`.
- `pages/life-insurance-calculator.html:170` -> encabezado `How Much Life Insurance Costs in 2025`.
- `pages/cheapest-health-insurance-plans.html:6` -> title con `2025`.
- `pages/cheapest-health-insurance-plans.html:7` -> meta description con `2025`.
- `pages/cheapest-health-insurance-plans.html:13` -> og:title con `2025`.
- `pages/cheapest-health-insurance-plans.html:17` -> Article headline con `2025`.
- `pages/cheapest-health-insurance-plans.html:67` -> H1 con `2025`.
- `pages/cheapest-health-insurance-plans.html:77` -> disclaimer con `2025`.
- `pages/cheapest-health-insurance-plans.html:103` -> referencia a `2025-2026 shopping patterns`.
- `pages/boat-insurance-guide.html:112` -> referencia a `2025-2026 shopping patterns`.
- `pages/long-term-care-insurance-guide.html:6` -> title `2025 Premiums`.
- `pages/long-term-care-insurance-guide.html:7` -> meta description con `2025`.
- `pages/long-term-care-insurance-guide.html:13` -> FAQ/Article con importes marcados como `2025`.
- `pages/long-term-care-insurance-guide.html:59` -> `data-title` con `2025 Premiums`.
- `pages/long-term-care-insurance-guide.html:60` -> H1 con `2025 Premiums`.
- `pages/long-term-care-insurance-guide.html:73` -> costes anuales descritos como `in 2025`.
- `pages/long-term-care-insurance-guide.html:94` -> costes mensuales descritos como `Average costs in 2025`.
- `pages/long-term-care-insurance-guide.html:122` -> nota de tabla `Based on 2025 industry data`.
- `pages/long-term-care-insurance-guide.html:127` -> beneficios diarios `In 2025`.
- `pages/rv-insurance-costs.html:6` -> title `How Much Does RV Insurance Cost in 2025?`.

8. **Redirect loops (check)**
- URLs OK (respuesta final directa `HTTP/2 200`, sin redirects intermedios):
  - `https://insurancecostguides.com/`
  - `https://insurancecostguides.com/contact`
  - `https://insurancecostguides.com/about`
  - `https://insurancecostguides.com/privacy-policy`
  - `https://insurancecostguides.com/pages/health-insurance-guide`
  - `https://insurancecostguides.com/pages/boat-insurance-guide`
- URLs con redirects múltiples: ninguna detectada en esta comprobación.

9. **Build status**
- OK, con matiz: el repo no contiene `package.json`, `generate-site.mjs`, `dist/`, `build/` ni `public/`.
- Validación ejecutada: `node --check main.js` -> OK.
- Interpretación operativa: el sitio se publica como HTML estático directo desde la raíz del proyecto y `pages/`.

10. **Recomendación de prioridad**
- Siguiente pasada recomendada: actualizar todos los restos de `2025`/`2024` en títulos, metas, FAQs y copy sensible al año, empezando por `cheapest-health-insurance-plans.html`, `long-term-care-insurance-guide.html`, `rv-insurance-costs.html` y `life-insurance-calculator.html`.
- Segunda prioridad: desplantillar los meta descriptions repetitivos detectados en el clúster de páginas nuevas para reducir huella de generación masiva.
- Tercera prioridad: decidir explícitamente si el email real también debe vivir en schema Organization o mantenerse solo visible en páginas de contacto/políticas.
