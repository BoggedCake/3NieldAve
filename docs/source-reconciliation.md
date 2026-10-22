# Source reconciliation — resolved

The supplied Netlify deployment was successfully recovered after the network change. Its SHA-256 is `a09d4d513e8ba38ad36714d2ba14fc3b74c702eb330e51ba693f4eee12692f53`. The original response is preserved byte for byte in Git commit `d01a4d0` as `index.html`, on feature branch `feat/fern-finishes-shore`.

GitHub main was fetched and remained at `874117d92bde37f1a48d3ab57070b8af7d63b9e2`. Its older page lacked the live deployment's expanded gallery, developer/builder presentation, three interactive floorplan panels, Q1 2027 completion references, and ground-floor bedroom descriptions. The recovered live deployment is therefore the implementation baseline. No content was reconstructed from the older page.

The recovered response contains 15 img elements plus the cover background. All original img sources and the cover are retained. The new exact SHORE JPEG is an additional image; it is not a generated or font-based approximation. The ZIP PDF and separately uploaded schedule are byte-identical to the original nine-page reference (SHA-256 `ba231054e143e41dc18d382dd1fbe7cab2e5a14cf1d204fb1f5967b2339651fb`).

The published floorplan section, captions, all area tables and the showFP script remain unchanged. The section SHA-256, between its FLOORPLANS and COMPARABLE SALES markers, is `1e67900dd644d4974948dc683b594547336f5ee927aaf2cd615dad5db7e8be8b`.

## Original investigation record

The following record is retained for provenance. Its blocker and missing-artwork statements were true at the earlier stage and are now resolved. Its older single-floorplan locator describes the historical GitHub source, not the recovered live baseline; use the current locators in `IMPLEMENTATION.md` instead.

---

# FERN implementation — source reconciliation blocker

## Verified source state

- GitHub `BoggedCake/3NieldAve`, fetched `origin/main`: `874117d92bde37f1a48d3ab57070b8af7d63b9e2`.
- Existing checkout HEAD matches that fetched commit. Working tree is unchanged.
- The sole tracked application file is `index.html`, with embedded assets. No project agent instructions, dependency manifest, build configuration, or test suite were found.
- This version states December 2026 completion, first-floor bedrooms, and oak finishes. These conflict with the newer live content described in the execution brief and the supplied ash flooring specification.
- The supplied Netlify deployment could not be downloaded: the environment egress proxy rejects the HTTPS CONNECT request with HTTP 403. No live HTML or deployment artifacts were recovered, so the actual newer content, navigation, builder section, and image containers cannot yet be verified.

## Work completed independently

- Read the implementation brief and extracted all nine PDF pages, including every specification category and the full disclaimer. See `finishes-extracted.txt`.
- Inspected the final PDF page visually. Its small black SHORE mark has no tagline and differs from the supplied official dark-green artwork; it is not a suitable replacement for that artwork.
- Inspected the logo and builder feedback shown in chat. The screenshot requests higher framing of an entry/stone image and an interior ceiling/space image. Their exact live source assets remain to be identified; the older checkout labels its interior images Living Room, Kitchen, and Winter Garden.
- Recorded the checkout's image attributes and source hashes in `repository-assets.json` for preservation checks. These are hashes of the HTML src strings, not decoded file bytes.
- Saved a draft network rule for the exact deployment hostname, preserving both existing Google Fonts custom rules and the selected package-manager preset. Saving the draft does not apply that rule to this runtime.

## Required unblock

Review and save the network change in environment settings, then publish as required by the product. The added hostname is `6ab0cbe9353144bc8669e4bc--curious-gnome-6d22a3.netlify.app`. Retry the read-only deployment download after the runtime policy changes. Alternatively supply the complete deployed source bundle with its assets.

The official SHORE logo is visible in chat, but no standalone artwork file is exposed in the workspace/download references. Supply its original PNG, JPG, or SVG file for exact embedding; do not approximate the wordmark using text or use the different mark from the PDF.

The brief explicitly requires stopping rather than reconstructing the newer site from assumptions when the correct source cannot safely be established. No application edits, feature commit, PR, or publication have been made. A feature branch must be created after the correct baseline is recovered and validated.

## Floorplan preservation and future replacement

In the current GitHub source, the floorplan is an embedded data URI in `/workspace/3NieldAve/index.html`, selected by `img.floorplan-img`, with alt text `Floor Plans — 3 Nield Avenue`. Its current src-string SHA-256 is `b6d7d72c350c9bddf1f68376cd097457b93440d3c270c45512a07f7a0f13d467`.

Leave the element, source, level labels, dimensions, and published area tables unchanged in this implementation. Reconcile its identity and location again against the recovered live baseline. For a later separately approved replacement, obtain verified real estate marketing floorplans, replace only the approved plan source(s), retain appropriate alt text and responsive sizing, and compare room labels, levels, dimensions, and area tables against approved documentation. Test the rendered result on mobile, desktop, and print.

## Resume sequence

1. Recover the supplied deployed page and all referenced assets. Compare rendered screenshots and complete content against fetched GitHub source; establish which version is current.
2. Create a dedicated feature branch from the validated baseline; preserve all verified newer content and floorplans.
3. Integrate the exact official logo, concise editorial finishes highlights, all 11 complete specification groups, and the PDF disclaimer using the existing presentation styles.
4. Reconcile ash/oak language and participant credits using evidence; record unresolved marketed features for confirmation.
5. Identify the two feedback images from their actual originals and containers; capture framing before/after and adjust only where source coverage permits.
6. Run and visually inspect browser checks at 1440, 1920, 768, 1024, 375, and 430 pixels; verify interactions, images, overflow, errors, print behavior, and source preservation.
7. Commit on the feature branch and submit a PR if GitHub write/API access permits. Do not merge or deploy without founder approval.
