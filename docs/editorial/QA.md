# Responsive editorial QA

Baseline: `bb4f7b17b6131168328e63ef67a52b43718c11e0`, fetched from the existing feature branch before editing. This report supersedes earlier presentation checks; earlier source reconciliation and founder evidence remain available as historical records.

## Browser verification

Chromium checks passed at **375, 390, 430, 768, 1024, 1440, 1920 and 2560px**. [Machine results](results.json) record no page errors or failed requests. The real Poppins font loaded. A further [19 continuous resize samples](resize-results.json), including both sides of breakpoints, passed overflow, native image ratio and complete-frame checks.

Commands (both exit 0):

```sh
FERN_QA_WIDTHS=375,390,430,768 FERN_QA_OUTPUT=/tmp/fern-editorial-mobile node tests/qa.cjs
FERN_QA_WIDTHS=1024,1440,1920,2560 FERN_QA_OUTPUT=/tmp/fern-editorial-desktop node tests/qa.cjs
```

All 17 image elements and the exterior background decode. The nine gallery/outlook images preserve native proportions, fit inside their figures, have no clipping ancestor and remain within controlled maximum widths. The square exterior is fully shown. Original embedded image bytes are unchanged, including the logos, headshot and plans. The audit covers every architectural subject and critical visual feature: [image audit](IMAGE_AUDIT.md), [source inventory](image-inventory.json).

Functional checks passed for eleven finishes categories, all 75 exact inclusions, disclaimer, keyboard access, contrast, all three plan tabs, original contact/enquiry links, PDF click opening a new tab with verified PDF bytes, and all 75 inclusions in print. Builder wording remains SHORE Projects; all three completion references remain Q2 2027. The portrait is present, decoded, visible, unobscured and correctly placed at every width. Five protected sections retain their geometry and text. This is not a claim of pixel identity for the redesigned page.

## Actual before and after screenshots

| View | Before | After |
| --- | --- | --- |
| Phone opening, 375px | [Before](screenshots/cover-375-before.jpg) | [After](screenshots/cover-375-after.jpg) |
| Phone gallery, 375px | [Before](screenshots/gallery-375-before.jpg) | [After](screenshots/gallery-375-after.jpg) |
| Desktop opening, 1440px | [Before](screenshots/cover-1440-before.jpg) | [After](screenshots/cover-1440-after.jpg) |
| Desktop gallery, 1440px | [Before](screenshots/gallery-1440-before.jpg) | [After](screenshots/gallery-1440-after.jpg) |
| Ultrawide gallery, 2560px | — | [After](screenshots/gallery-2560-after.jpg) |

Full-page before/after screenshots were captured at all eight required widths, plus materials, partners and footer evidence. The workspace manifest is `/workspace/fern-review/editorial-evidence.md`; full-page captures remain in `/tmp/fern-editorial-mobile` and `/tmp/fern-editorial-desktop` to avoid committing large redundant PNGs. Representative comparison JPEGs above are committed for durable PR review.

Critical visual inspection covered the contact sheet, opening, galleries, partners and footer, including tablet and ultrawide. An independent reviewer found no remaining visual blockers. The compositions show complete islands, arrival stonework, room connections and bathroom features; restrained portrait images and controlled widths avoid oversized detail tiles. Approved partner treatment and agent footer remain intact.

## Limits and preview delivery

The single-file artifact is preserved: no sibling-image dependencies are introduced. Lazy decode/paint and reserved native dimensions improve rendering behaviour, but embedded image transfer is not reduced. Local load timings are not mobile network benchmarks. Browser coverage is Chromium; physical-device Safari testing is not claimed.

Updated standalone review file: `/workspace/fern-review/FERN-founder-preview.html`.

A new hosted Vercel Preview cannot be created from this environment: no enabled Vercel deployment tool, CLI authentication, token binding or local project binding is available. Access to the supplied existing preview fails at the proxy with `CONNECT tunnel failed, response 403` (Envoy). The existing GitHub integration has a successful older check, but its target/production-branch configuration cannot be verified without project access. The commit uses `[skip vercel]` to avoid an automatic deployment with an unverified target. No new hosted Preview is claimed. No Production deployment, production alias, Netlify configuration or SitePivot project/repository was changed.

Review only: retain draft PR #1; do not merge.
