# JetztAberPROMPT! Website

Static website for `www.jetztaberprompt.de`, hosted via GitHub Pages.

## Files

- `index.html` — homepage and course overview
- `kurse/*/index.html` — dedicated course pages with clean URLs
- `styles.css` — shared responsive styling
- `script.js` — mobile menu and reveal animation
- `assets/jetztaber-wordmark.svg` — outlined desktop and footer wordmark
- `assets/jetztaber-mark.svg` — compact mobile brand mark
- `assets/favicon.svg` — high-contrast brand favicon
- `assets/og-image.png` — social preview image
- `impressum.html` — legal notice
- `datenschutz.html` — privacy policy
- `sitemap.xml` — canonical URL list for search engines
- `robots.txt` — crawler guidance and sitemap reference
- `CNAME` — GitHub Pages custom domain

## Local Preview

Run a local static server from the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:4173/
```

## Before Publishing

Review the legal pages, course wording, and contact links before launch. The primary contact email used by the site is:

```txt
sebastianvauth@gmail.com
```

The canonical production domain is:

```txt
https://www.jetztaberprompt.de/
```
