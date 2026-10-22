# Blended hero refinement

Baseline: `e07735c`, the approved editorial-gallery branch state. Application changes are limited to desktop and responsive hero CSS. `tests/hero-qa.cjs` removes only those two CSS blocks and asserts that the rest of the complete HTML file is byte-identical, protecting gallery styles, ordering, images, logos, headshot, finishes, floorplans, PDF, copy and footer.

The original shared architectural backdrop and navy overlay language is restored. A horizontal fade reaches navy exactly at the render edge on desktop, removing the hard split. The top shade spans the whole opening. Mobile places the logo/opportunity label over the render and overlaps the copy with its gradual vertical fade, rather than stacking three distinct panels. Original image bytes and every word remain unchanged.

## Browser evidence

Final hero browser checks passed at **390, 430, 768, 1440, 1920 and 2560px**: image/logo decode, actual Poppins loading, shared background, fade-edge alignment, clear header/text spacing, no logo/tag collision, content containment and no horizontal overflow. Mobile text begins within the fading image region. All six screenshots were visually inspected for the blended presentation and readability. [Hero geometry results](results.json).

The broader regression suite also passed at all six widths: native gallery frames and clipping checks, 17 decoded image elements plus background, eleven categories and 75 exact inclusions, PDF new-tab opening and checksum, all plan tabs, commercial wording, Q2 2027 timing, SHORE Projects, headshot and contacts. Continuous resizing passed its 19 samples, and print retained all 75 inclusions. No page errors or failed requests. [Regression results](regression-results.json). Final top-shade polishing was subsequently rechecked by the six-width hero suite; protected downstream source remains exact.

Commands:

```sh
node tests/hero-qa.cjs
FERN_QA_WIDTHS=390,430,768 FERN_QA_OUTPUT=/tmp/fern-hero-mobile node tests/qa.cjs
FERN_QA_WIDTHS=1440,1920,2560 FERN_QA_OUTPUT=/tmp/fern-hero-desktop node tests/qa.cjs
```

| Width | Before | Revised blended hero |
| --- | --- | --- |
| 390px | [Before](hero-390-before.jpg) | [After](hero-390-after.jpg) |
| 430px | [Before](hero-430-before.jpg) | [After](hero-430-after.jpg) |
| 768px | [Before](hero-768-before.jpg) | [After](hero-768-after.jpg) |
| 1440px | [Before](hero-1440-before.jpg) | [After](hero-1440-after.jpg) |
| 1920px | [Before](hero-1920-before.jpg) | [After](hero-1920-after.jpg) |
| 2560px | [Before](hero-2560-before.jpg) | [After](hero-2560-after.jpg) |

Updated self-contained preview: `/workspace/fern-review/FERN-founder-preview.html`. Existing hosted preview limitations remain documented in the editorial QA report; no new deployment is claimed. Keep draft PR #1 open for founder review. No merge or deployment.
