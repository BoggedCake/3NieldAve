# Exact approved floorplans and continuous hero fade

Application changes are limited to `index.html`: replace superseded embedded floorplans with the exact two approved PNGs, preserve natural image proportions, and correct the hero transparency. Tests and evidence are listed below. Baseline is `24c0837` on `feat/fern-finishes-shore`.

## Floorplans

`FERN_floorplans_EXACT_for_Codex.zip` contains two 1920 × 1280 PNGs. Both are embedded without modification; [byte counts and SHA-256 hashes](floorplan-checksums.json) match the ZIP entries exactly. The 2D sheet visibly contains **Living/Lounge** beside the kitchen; neither sheet contains the removed numerical internal/external notes. No redraw, regeneration, retouching or recompression occurred.

The previous HTML contained three per-floor technical drawings, not a 2D/3D pair. These three embedded payloads are removed from active source. The same tab styling and existing `showFP` switching code now select **2D Floorplan / 3D Floorplan**, because both authoritative sheets contain all floors. Original three descriptive captions and both residence specification tables are retained. Native width/height attributes reserve space; `height:auto` preserves the 3:2 ratio on mobile. Browser pinch zoom remains available; no custom zoom code existed to replace. No service worker or new external image path is introduced: the changed data URIs travel with each new HTML deployment, avoiding stale sibling image URLs.

## Hero correction

The prior CSS stretched the render with hero height while its horizontal navy overlay remained fixed at 720px. The new square backdrop uses an image-relative transparency mask: horizontal on desktop, vertical below 1024px. The entire render, including its top shade, becomes transparent at its actual edge and reveals the same parent navy, rather than relying on a separately sized overlay. Full native image proportions, text, header placement and the approved downstream gallery are retained.

Source assertions protect the entire document outside the hero rules, floorplan viewer and required floorplan height rule. Original gallery image bytes/order/CSS, partners, finishes, PDF, contacts, headshot, property information and footer remain exact. Floorplan switching script is byte-identical.

## Automated local verification

All commands exit 0:

```sh
FERN_QA_OUTPUT=/tmp/fern-exact-hero node tests/hero-qa.cjs
python tests/hero-edge-qa.py /tmp/fern-exact-hero
FERN_QA_WIDTHS=390,430,768 FERN_QA_OUTPUT=/tmp/fern-exact-mobile node tests/qa.cjs
FERN_QA_WIDTHS=1440,1920,2560 FERN_QA_OUTPUT=/tmp/fern-exact-desktop node tests/qa.cjs
```

Six widths passed: **390, 430, 768, 1440, 1920 and 2560px**, plus 19 continuous resize samples. Six hero edge screenshots and a deliberately increased 900px hero passed actual PNG-pixel boundary checks against navy (maximum permitted channel difference 2/255; measured 0–1). Assertions also cover logo/header/text containment, no overlap, no horizontal overflow, native architecture proportions, image decoding, exact plan hashes and removal of old payloads, both plan tabs, all eleven categories and 75 entries, print, original contact/enquiry links, real Poppins, working PDF bytes and new-tab opening, SHORE Projects wording and Q2 2027. No page errors or failed asset requests. The same source comparisons protect unmodified sections.

[Hero geometry](hero-results.json) · [Pixel edge checks](hero-edge-results.json) · [Regression results](regression-results.json) · [Continuous resize](resize-results.json)

## Actual local visual inspection

Original PNGs and the browser-rendered desktop/mobile versions were opened and inspected separately from test assertions. The architectural subject remains prominent, the fade is continuous, the approved floorplan sheets are fully shown, no area notes reappear, and the 2D label is visible at native/desktop scale. On a phone the complete sheets are scaled to the existing content width; fine plan lettering requires browser zoom. Actual screenshots:

| View | Screenshot |
| --- | --- |
| Hero 390px | [Rendered hero](hero-390-after.jpg) |
| Hero 430px | [Rendered hero](hero-430-after.jpg) |
| Hero 768px | [Rendered hero](hero-768-after.jpg) |
| Hero 1440px | [Rendered hero](hero-1440-after.jpg) |
| Hero 1920px | [Rendered hero](hero-1920-after.jpg) |
| Hero 2560px | [Rendered hero](hero-2560-after.jpg) |

| 2D desktop | [2D floorplan](floorplan-2d-1440.png) |
| 3D desktop | [3D floorplan](floorplan-3d-1440.png) |
| 2D phone | [2D floorplan](floorplan-2d-390.png) |
| 3D phone | [3D floorplan](floorplan-3d-390.png) |

Full-page, partners, contact, finishes and plan captures at all widths remain in `/tmp/fern-exact-mobile` and `/tmp/fern-exact-desktop`. The updated single-file artifact is `/workspace/fern-review/FERN-founder-preview.html`.

## Deployment and live verification

The feature branch is pushed without a deployment skip directive to trigger its established Vercel Preview integration. GitHub status and Vercel bot deployment metadata are checked against the exact new commit after pushing. Deployment identifiers and live access results are recorded in the PR update; they cannot be committed into the same commit they identify.

Local screenshots are explicitly **not live-preview screenshots**. Live browser verification is attempted separately; if the proxy rejects access, deployment status establishes only that Vercel reports building this source commit, not a visual check of hosted output. No Production deployment, DNS, production alias, Netlify or unrelated project configuration is changed.
