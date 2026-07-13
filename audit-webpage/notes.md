# Webpage Audit Notes

Audit date: 2026-07-08
Target: `http://127.0.0.1:4173/` from the local static site

## Captured Steps

1. Desktop hero: `01-desktop-top.png`
   - Health: strong visual identity, but the headline dominates so much that the primary CTA falls below the first viewport.
2. Mobile hero: `02-mobile-top.png`
   - Health: clean and readable, with both CTAs visible; still very headline-heavy.
3. Mobile menu open: `03-mobile-menu-open.png`
   - Health: functional and legible; the toggle state is not visually transformed into a close action.
4. Desktop course cards: `04-desktop-courses.png`
   - Health: polished cards and clear course progression; the copy is outcome-oriented but missing decision details such as duration, price, dates, prerequisites, and target audience nuance.
5. Desktop contact CTA: `05-desktop-contact.png`
   - Health: clean CTA block, but the main email link still points to a placeholder address and the CTA is less specific than a booking or course-specific inquiry.

## Highest-Impact Recommendations

1. Make the hero convert faster.
   - Reduce desktop `h1` scale or tighten the hero layout so the lead and CTA are visible above the fold on a 1440x900 viewport.
   - Add a short positioning line above the headline, such as "KI-Kurse und Workshops fuer Selbststaendige, Gruender:innen und Teams".
   - Use the existing unused trust-row style for concrete signals: formats, live work, German-language, team workshops, app/MVP outcomes.

2. Sharpen the copy around the buyer's decision.
   - Replace broad phrases like "alle Menschen" with a clearer primary audience.
   - Add "For whom", "What you leave with", "Duration", "Format", and "Best next step" per course.
   - Make course CTAs specific: "Workshop anfragen", "MVP-Coaching anfragen", "Business-Kurs anfragen".

3. Fix launch-readiness details.
   - Update the primary contact mailto from `hello@deine-domain.de` and the old `AI Business Academy` subject.
   - Normalize brand capitalization across title, nav, OG tags, and footer: currently `JetztAberPROMPT!` and `JetztAberPrompt!` both appear.
   - Fix typo/casing in `Dein #kI Business Launch Kit`.
   - Update `README.md`, which still describes the site as "AI Business Academy".

4. Strengthen SEO metadata and page structure.
   - Add canonical URL for `https://www.jetztaberprompt.de/`.
   - Add `og:url`, `og:image`, Twitter card tags, and German locale metadata.
   - Give legal pages their own meta descriptions.
   - Consider dedicated pages for each course if search traffic matters; one landing page is harder to rank for separate intents like "KI Workshop", "KI Agenten Kurs", and "AI Coding Agent Kurs".
   - If adding structured data, use current Google guidance and validate it. Course-list rich results have availability constraints, so schema should be accurate but not treated as a guaranteed rich result.

5. Add proof.
   - Include a short Sebastian Vauth profile section, credentials, client logos, testimonials, sample workshop agenda, or screenshots of course outputs.
   - Replace or complement the abstract learning-path panel with something more concrete: a real workshop photo, example playbook/MVP/blueprint preview, or a course artifact screenshot.

6. Improve accessibility and interaction polish.
   - Add `:focus-visible` styles for buttons, nav links, course links, and the mobile menu toggle.
   - Change the mobile toggle label to "Menue schliessen" when open and visually morph the icon into a close icon.
   - Make revealed content visible without JavaScript by default, then add animation only when JS is available.
   - Add `scroll-margin-top` or adjusted anchor behavior so section navigation lands with clearer context under the sticky header.

## Evidence Limits

This was a visual and source-level audit of the local static page. It did not test live production indexing, Core Web Vitals, Search Console data, real mobile devices, screen readers, or keyboard-only navigation beyond source inspection.
