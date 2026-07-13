# Ginsberg Shulman website redesign: audit and implementation plan

Date: July 13, 2026  
Status: Public-site audit and independent staging concept. No changes were made to ginsbergshulman.com.

## Executive assessment

The current site has strong underlying value: clear practice focus, two unusually strong attorney credential stories, a substantial and recently active article library, useful Florida-specific FAQs, dedicated office pages, working lead capture, and a technically mature WordPress setup. The redesign should preserve that substance and the existing URL footprint while replacing a conventional law-firm presentation with a quieter private-client advisory identity.

The main opportunity is not adding more material. It is editing, prioritizing, and organizing what is already there. The homepage currently repeats similar claims, places a long consultation form in the primary content flow, mixes high-value credential material with operational claims, and gives equal visual weight to too many messages. The new direction makes the board certifications and practice focus immediately legible, introduces the attorneys without turning them into oversized hero imagery, organizes services around client situations, and moves educational content into a structured resource layer.

## What is on the current site

Public inventory from the live XML sitemaps:

- 59 blog URLs, including the blog index.
- 12 standard pages, including the homepage, About, Contact, FAQ, locations, certification, privacy, disclaimer, and two geographic landing pages.
- 2 attorney profiles.
- 12 practice pages.
- 2 office-location pages.
- 8 individual FAQ pages.

The live public stack exposes:

- WordPress on WP Engine, behind Cloudflare.
- Custom `jem` child theme on Understrap.
- Yoast SEO 27.9, with XML sitemaps and schema output.
- Gravity Forms 2.10.5 for the consultation form.
- WP Rocket 3.22.0.3 for caching, minification, image and iframe lazy loading, local fonts, and related performance work.
- Google Tag Manager `GTM-NJP4238` and Google Analytics `G-SYZS121SMT`.
- CallRail number-swapping script.
- Public REST namespaces indicating Google Site Kit, Wordfence, WP Engine cache/sign-on tooling, Yoast, WP Rocket, Gravity Forms, and Duplicate Post.
- `llms.txt` with a useful structured summary of the firm, services, attorneys, geographic scope, and preferred firm citation.
- Custom post types for attorneys, practices, locations, and FAQs.

This audit does not claim access to WordPress administration, the theme repository, plugin settings, Gravity Forms notifications, CallRail configuration, redirects, consent tooling, WP Engine staging, or analytics reports. Those items require a configuration export or administrator access before implementation.

## What should be preserved

- Every currently indexed URL unless a written redirect map approves a change.
- Existing Yoast titles, descriptions, canonicals, breadcrumbs, XML sitemaps, and schema until a page-by-page SEO migration sheet is approved.
- The current attorney profile facts and credential details, subject to attorney review.
- The 59-post article library and eight FAQ pages.
- Location pages and their `locations` post type.
- Gravity Forms routing, notifications, spam controls, and consent behavior after those settings are documented.
- Google Tag Manager, GA4, CallRail, Search Console ownership, WP Engine, Cloudflare, WP Rocket, Wordfence, and existing verified integrations.
- The public `llms.txt`, updated only after the final information architecture is settled.

## Priority issues

### High priority

1. **Homepage hierarchy is diffuse.** The current page carries a hero, firm overview, service descriptions, attorney biographies, certification explanation, FAQs, a long form, and another closing pitch without a strong editorial hierarchy.
2. **The public value proposition is mixed with internal-operation claims.** Copy about intake, handoffs, calls, and staffing does not help a sophisticated client evaluate the legal work and creates avoidable factual-maintenance risk.
3. **The main navigation understates the breadth of the practice.** Only four practice areas appear in the primary menu even though the site contains 12 practice pages and meaningful tax, special-needs, asset-protection, vulnerable-adult, and business-planning material.
4. **The homepage consultation form is too long for its location.** It interrupts the page, asks multiple qualifying questions before the visitor has decided to engage, and visually competes with the content around it.
5. **The design language is conventional.** The current visual system does not express the distinction created by two board-certified attorneys with IRS, accounting, tax, guardianship, and fiduciary experience.

### Medium priority

1. **Resource discovery is shallow.** A single Blog link does not reveal the breadth of the current articles, videos, and FAQs or help visitors navigate by decision or practice area.
2. **The attorney sections are verbose on the homepage.** They should introduce the attorneys and credentials, then move detailed biography and representative experience to focused profile pages.
3. **Practice-page templates should be more scannable.** Every page should clearly answer who it is for, when counsel is needed, what the firm handles, likely process, related issues, attorney fit, and next step.
4. **Mobile content order needs deliberate control.** Credentials, practice fit, and contact action should appear before secondary narrative and resource material.
5. **Accessibility needs formal verification.** The rebuild should include keyboard, focus, contrast, label, landmark, heading, alternative-text, reduced-motion, zoom, and screen-reader checks rather than relying on visual review alone.

## Proposed information architecture

- Home
- Attorneys
  - Jill R. Ginsberg
  - David A. Shulman
- Services
  - Estate Planning
  - Probate & Estate Administration
  - Trust Administration
  - Guardianship
  - Elder Law & Medicaid Planning
  - Tax & Wealth Preservation
  - Business Succession
  - Supporting detail pages retained beneath those pillars
- Resources
  - Articles & Guides
  - Videos
  - FAQs
- About
- Contact

The current detail pages should remain at their existing URLs. The new top-level service architecture is a navigation and presentation layer, not permission to delete or merge indexed content.

## Homepage strategy represented in the staging concept

1. Immediate practice and jurisdiction cue.
2. Single positioning line focused on complex family and fiduciary decisions.
3. Board-certification proof beside the hero rather than a large portrait or decorative effect.
4. Compact location and service-area trust strip.
5. Six client-situation entry points.
6. Private-client positioning and certification explanation.
7. Restrained attorney introductions with smaller portraits.
8. Three-step consultation process.
9. Curated resources rather than a generic blog feed.
10. Short closing request for consultation.

## Visual and interaction direction

- Deep ink, warm paper, muted brass, and restrained oxblood rather than a bright or trendy palette.
- Editorial serif typography paired with a quiet system sans serif; no third-party font dependency in the concept.
- Fine rules, asymmetrical grids, and compact credential panels instead of stock legal imagery.
- Real office photography used as supporting context, not as a full-screen lifestyle claim.
- Attorney portraits kept modest in scale.
- No WebGL, parallax, carousels, splash animation, or ornamental motion.
- Motion limited to basic hover and menu behavior, with reduced-motion support.

## WordPress implementation plan

1. Create a fresh WP Engine staging copy and take a downloadable database and uploads backup before any theme work.
2. Export the current URL inventory, redirects, Yoast metadata, schema behavior, forms and notifications, analytics tags, CallRail rules, users, theme settings, and plugin list.
3. Build the approved design as a lightweight child-theme or block-theme implementation using the existing WordPress content model. Do not migrate content into a separate page-builder ecosystem.
4. Create reusable blocks/patterns for the hero, credential strip, service grid, attorney introduction, process, resources, CTA, interior-page hero, practice-page sections, biography credentials, and contact layout.
5. Map the new service navigation to the existing practice URLs. Any proposed slug change gets a one-to-one 301 redirect and canonical review before launch.
6. Rebuild the consultation experience in Gravity Forms, preserving notifications and routing. Keep the form concise, add clear non-confidentiality and no-attorney-client-relationship language, and verify spam protection and completion tracking.
7. Reconnect GTM, GA4, CallRail, Search Console, Yoast, WP Rocket, Wordfence, and WP Engine tooling in staging without duplicating tags.
8. Perform content review with separate sign-off for legal accuracy, attorney credentials, board-certification wording, locations, phone numbers, and approved claims.
9. Run staging QA across current mobile and desktop breakpoints, keyboard navigation, screen readers, zoom, form validation, Core Web Vitals, structured data, sitemap coverage, canonical URLs, broken links, and redirect behavior.
10. Produce a launch change log and rollback checklist. Publish only after express approval.

## Launch acceptance criteria

- No lost indexed URL without an approved redirect.
- No staging `noindex` setting carried onto production.
- One analytics implementation, one CallRail implementation, and verified form conversions.
- Correct titles, descriptions, canonicals, breadcrumbs, schema, sitemaps, robots rules, and `llms.txt`.
- All forms deliver to the intended recipients and store entries as expected.
- Keyboard and screen-reader paths work for navigation, form fields, validation, accordions, and menus.
- Mobile pages have no horizontal overflow, text remains readable at 200% zoom, and tap targets are usable.
- The production site is read back after launch with a cache-busted verification, and the rollback package remains available.

## Staging concept scope

The independent concept includes a new homepage, service overview, estate-planning page template, attorney overview, resources template, and consultation page. It is deliberately marked `noindex, nofollow`; the form does not transmit data; and the concept does not alter the production WordPress site.
