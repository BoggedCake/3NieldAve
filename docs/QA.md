# FERN QA evidence

Browser validation passed at all requested widths using Chromium and the actual Poppins fonts. The saved results are in [qa/results.json](qa/results.json).

| Width | Categories / inclusions | Images decoded | Preserved visual regions | Page errors | Application request failures |
| ---: | --- | ---: | ---: | ---: | ---: |
| 375 | 11 / 75 | 16 + cover | 9 | 0 | 0 |
| 430 | 11 / 75 | 16 + cover | 9 | 0 | 0 |
| 768 | 11 / 75 | 16 + cover | 9 | 0 | 0 |
| 1024 | 11 / 75 | 16 + cover | 9 | 0 | 0 |
| 1440 | 11 / 75 | 16 + cover | 9 | 0 | 0 |
| 1920 | 11 / 75 | 16 + cover | 9 | 0 | 0 |

All six widths passed horizontal-overflow checks, keyboard opening/closing of all specification categories, exact label/description pairing, exact PDF disclaimer, small-text contrast checks for the new schedule, original image-source preservation, full uncropped Entry/Dining proportions and containment, Q1 2027 retention, existing contact-link preservation, downloadable PDF access and all three floorplan tab interactions.

The complete floorplan markup, area tables, plan sources/captions and original interaction script are byte-identical to baseline commit `d01a4d0`. The cover and all original fifteen image sources were also independently checked by a read-only reviewer. Both supplied assets have checksum assertions in the test suite.

Nine unaffected regions were compared pixel for pixel at each width: living hero; family/kitchen; bedroom; powder/ensuite; floorplans and area tables; comparable sales; location; agency footer; legal footer. Captures were isolated at a common integer origin with the original width/height checked, to remove fractional scroll-position raster differences. Less than one bottom CSS pixel is excluded from isolated captures to avoid sampling a neighbouring section. Full-page before/after screenshots separately preserve actual layout flow and were visually reviewed for lost content and overlap.

## Framing evidence

The Entry render originally overflowed its fixed-height desktop gallery. Dining was cropped at the sides, losing the full room composition and stone island. Both original image sources now display in full at their natural aspect ratios, with the desktop split adjusted to match their proportions. On mobile the full images stack vertically.

| Size | Original live framing | Enhanced framing |
| --- | --- | --- |
| 1440 desktop | [Before](qa/framing-1440-before.png) | [After](qa/framing-1440-after.png) |
| 375 mobile | [Before](qa/framing-375-before.png) | [After](qa/framing-375-after.png) |

Full-page, materials, partner and framing screenshots for all six widths are retained in this workspace under `/tmp/fern-qa-wide` and `/tmp/fern-qa-narrow`. A test run can regenerate them; only representative framing evidence is committed to avoid inflating the repository with every full-page image.

## Print, typography, performance and review

- Print output exposes all 75 schedule descriptions even when screen details are collapsed; verified against text extracted from the generated A4 PDF. Existing floorplan print behaviour is preserved rather than redesigned.
- The cloud Chromium trust store initially rejected the proxy certificate for Google Fonts. The QA harness loads font responses through system curl with TLS verification enabled, and asserts real Poppins faces loaded. Production font URLs and certificate verification are unchanged.
- No new application dependencies or JavaScript. Uncompressed initial HTML plus the additional logo grows by about 2.04%; the PDF is fetched only when requested. Browser load timings are recorded as local observations, not public speed guarantees.
- Independent read-only review verified schedule completeness, disclaimer, logo bytes, source recovery, original imagery and plan preservation. Its one new-text contrast finding was fixed and covered by automated contrast assertions.
- The only mobile layout defect found in the recovered baseline was the three-column overview grid overflowing at 375 pixels. It now uses two shrinkable columns on mobile. No overflow remains in the tested widths.
- The repository has no build toolchain, lint command or prior automated suite. `node tests/qa.cjs` is the relevant functional and visual suite; no unrun build is represented as passing.

## Delivery limitation

HTTPS Git fetch/push works. GitHub API access does not: the egress proxy rejects HTTPS CONNECT to `api.github.com` with HTTP 403 before PR creation. An additive network draft allowing that exact hostname was saved while preserving existing custom rules. That draft does not change runtime access until saved/applied through environment settings and published as required by the product. No new token has been requested; Git authentication already works.

The complete PR title/body is prepared in [PR_DESCRIPTION.md](PR_DESCRIPTION.md). Founder review can use the pushed feature branch and its GitHub compare page while API access is resolved. Nothing has been merged or deployed.
