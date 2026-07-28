# JetztAberPROMPT! Website

Static website for `www.jetztaberprompt.de`, hosted via GitHub Pages.

## Files

- `index.html` — homepage for the KI launch lab
- `kurse/prompting-up-a-business/index.html` — detailed program and session curriculum
- `bewerben/index.html` — cohort application form
- `course-data.js` — shared course facts, cohort status, CTA labels, and application configuration
- `styles.css` — shared responsive styling
- `script.js` — shared content injection, navigation, analytics hooks, and form behavior
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

## Course and Cohort Updates

Edit stable program facts only in `course-data.js`. Cohort dates are stored separately in the `cohorts` array so a new cohort can be published without rewriting the course pages.

The application page currently uses a privacy-preserving static-site fallback: after validation, it displays a prefilled email action that the applicant can open and send. To submit applications directly, set `applicationEndpoint` in `course-data.js` to an HTTPS endpoint that accepts JSON. The endpoint must provide its own server-side validation, spam protection, secure storage, notification workflow, retention policy, and CORS configuration before launch.

The JavaScript emits privacy-safe `jap:analytics` browser events for program views, CTA clicks, application starts, email preparations, submissions, errors, and FAQ interactions. It forwards them to Plausible only when Plausible is already configured; free-text application answers are never included.

## Before Publishing

Review the legal pages and configure the final application workflow before launch. The primary contact email used by the site is:

```txt
sebastianvauth@gmail.com
```

The canonical production domain is:

```txt
https://www.jetztaberprompt.de/
```
