# FERN finishes and builder feedback

This enhancement uses the recovered live Netlify IM, not the older GitHub page. The unmodified live response is committed as `d01a4d07dfaf30372148bf64aef05ba4c08ff3ec`; see [source reconciliation](source-reconciliation.md). Q1 2027 completion, ground-floor bedrooms, the expanded gallery, builder/developer information and all original contact links are retained.

## Changes

- Added FERN identification to the existing cover eyebrow without changing its address-led composition.
- Replaced the font approximation of SHORE with the exact supplied JPEG, including its green wordmark and tagline. The existing dark builder panel and developer panel remain.
- Added editorial material highlights and eleven native, keyboard-operable expandable specification categories. The complete schedule contains 75 labelled entries, transcribed from the PDF without dropping brands, room-specific distinctions or provisions. The supplied PDF is linked separately and is not downloaded during normal initial page loading.
- Preserved the complete builder disclaimer, including natural variation, equal-or-better substitutions, contract status and purchaser enquiries.
- Replaced the conflicting oak reference with engineered European ash. Removed the unsupported attribution of architectural design to SHORE; its verified builder role remains explicit.
- Retained Q1 2027 and replaced the stale relative “~6–7 months” countdown with “Target completion”.
- Displayed the original Entry and Dining images in full. Their natural aspect ratios define the desktop column proportions; mobile stacks them at natural height. This removes Entry's overflow from its former fixed-height grid and Dining's side cropping. No source image pixels were altered.
- Corrected the live page's pre-existing mobile overview-grid overflow by using two columns with shrinkable tracks. New schedule small text has WCAG AA contrast on white; the existing design palette remains elsewhere.

No framework, runtime library, paid service, tracking, or new production JavaScript was introduced. All original fifteen image elements and cover image remain unchanged. The additional SHORE JPEG is 63,668 bytes. HTML grew by 15,162 bytes from 3,858,918 bytes; combined initial uncompressed HTML/image payload increases by about 2.04%. The 4 MB PDF loads only when requested. These are payload measurements, not a claim about public deployment speed.

## Specification completeness

| Category | Entries |
| --- | ---: |
| 01 Architecture & Façade | 7 |
| 02 Landscape, Paving & Pool | 8 |
| 03 General Interior Finishes | 6 |
| 04 Foyer, Mudroom & Staircase | 4 |
| 05 Kitchen & Butler’s Pantry | 9 |
| 06 Dining, Bar, Living & Family | 5 |
| 07 Master & Secondary Bedrooms | 3 |
| 08 Master Ensuite | 11 |
| 09 Main Bathroom | 8 |
| 10 Powder Room & Laundry | 6 |
| 11 Comfort, Technology & Services | 8 |
| **Total** | **75** |

The independent transcription is in [finishes-reference.json](reference/finishes-reference.json), and the original extracted text is retained in [finishes-extracted.txt](reference/finishes-extracted.txt). The original and newly uploaded PDFs are byte-identical. Source asset checksums are recorded in [source-checksums.json](reference/source-checksums.json).

## Floorplans — unchanged

The complete `<!-- FLOORPLANS -->` to `<!-- COMPARABLE SALES -->` region in `index.html` is byte-identical to the recovered live source. This includes captions, levels, dimensions in the original plan images, residence area tables and tabs. The `showFP` script is also unchanged.

Current embedded plan image locators:

| Level | Source location in index.html |
| --- | --- |
| Basement | `#fp-basement img.fp-img` |
| Ground Floor | `#fp-ground img.fp-img` |
| First Floor | `#fp-first img.fp-img` |

When approved real estate marketing floorplans arrive, locate these elements and replace only their approved image sources. Preserve the current captions, level labels, tab IDs, area tables and interaction until separately verified evidence authorises changes. Compare dimensions, room labels and areas with the approved documents, then rerun browser checks and inspect desktop/mobile/print output. The current byte-preservation test must only be updated as part of that separately authorised replacement.

## Items for founder/builder confirmation

- Doroch Architects is named in the brief but not verified by the supplied schedule. No architect credit has been invented. Confirm the architect against approved project documentation before adding one. The PDF footer itself says “Designed & Built By” SHORE; the IM avoids using that phrase to assign the architectural role.
- The live IM's lift, cinema, gym/sauna, wine wall, gas fireplace, outdoor kitchen and harbour-view claims are retained. The finishes schedule does not independently document all these marketed features; obtain builder confirmation rather than treating their absence from the schedule as a reason to remove them.
- Q1 2027 completion and basement-excavation status are retained from the live IM, not independently certified construction progress. Founder/builder should confirm that these remain current.
- Existing comparable-sales statements and published area figures are preserved, not newly verified valuations or measurements.
- Replacement marketing floorplans are still outstanding and intentionally excluded.

## Development and review

Serve the repository with Python's built-in HTTP server or any static server. No build or package installation is required in the prepared cloud environment. Run `node tests/qa.cjs` from the repository root for browser validation. It uses the preinstalled Playwright module and `/usr/bin/chromium`, and reads the recovered baseline from Git history. Preserve that baseline commit when fetching a shallow checkout for QA.

Screenshots and print output default to `/tmp/fern-qa`; set `FERN_QA_OUTPUT` to retain them elsewhere. The full default run tests 1440, 1920, 768, 1024, 375 and 430 pixels; `FERN_QA_WIDTHS` selects a subset for diagnosis. The local test server binds a temporary loopback port and closes after the run. Screenshot comparisons isolate unchanged sections at an integer origin, preserving their actual width and checking their height; this avoids fractional-page-position raster noise. Full-page screenshots additionally capture the actual page flow.

Chromium's trust store in this cloud instance does not recognise the HTTPS proxy CA for Google Fonts. The QA harness obtains those font responses through system `curl`, which validates TLS and returns the verified font bytes to the browser. It never disables TLS validation. The same font responses are used for both baseline and enhanced pages; real loaded Poppins faces are asserted. This adjustment is confined to QA and does not alter production font URLs.

The feature branch is `feat/fern-finishes-shore`, submitted as [draft PR #1](https://github.com/BoggedCake/3NieldAve/pull/1). No merge or deployment is authorised or performed. Initial REST connectivity failures did not prevent the later authenticated PR creation; see `QA.md`.
