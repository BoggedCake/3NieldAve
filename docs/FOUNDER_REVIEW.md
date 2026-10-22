# Founder review revisions

Continues draft PR #1 on `feat/fern-finishes-shore`, using commit `4bbae04` as the approved implementation baseline. No IM rebuild, floorplan change, merge or live deployment.

## Logo and PDF diagnosis

Both files were present and valid in Git. The problem reproduced when the HTML was displayed independently of the repository asset directory: `assets/shore-logo.jpg` and `assets/fern-finishes-inclusions.pdf` resolved relative to the preview document and returned 404. The earlier tests served the complete checkout and therefore did not catch that preview packaging dependency. The precise founder-hosted preview URL has been requested; no linked deployment or preview checks are attached to PR #1.

The logo now embeds the exact supplied JPEG as a data URI, consistent with the original IM's embedded images. Its decoded checksum is tested against the supplied artwork. There is no font approximation, artwork alteration or separate logo request to fail.

The schedule is a direct HTTPS PDF link that opens a separate tab with `noopener noreferrer`. It points to the unchanged PDF already committed in this public repository, served by jsDelivr from the fixed full commit `5b563e21da49145c26cb5892e0eaa6b734d66164`. The endpoint returned HTTP 200 and `Content-Type: application/pdf`; downloaded bytes match the supplied schedule's SHA-256. It uses no embedded viewer or relative asset path, and does not require deployment of the main site. The local PDF remains in `assets/fern-finishes-inclusions.pdf` as the source record.

The test server now deliberately serves the updated IM at a nested HTML-only preview path whose sibling asset paths do not exist. Browser tests click the actual PDF link, verify the new tab reaches the direct document, decode the embedded logo, and verify its original bytes. The established TLS-verified font-fetch adapter remains in place; the same approach supplies verified PDF bytes to Chromium where its cloud proxy trust store differs from system curl. Remote PDF bytes are fetched and checksum-verified during every viewport test.

## Text changes

All visible builder references, including the logo's accessible description, use **SHORE Projects**. The supplied artwork is unchanged and retains its original wordmark and tagline.

The cover statistic, executive-summary statistic and construction paragraph now use **Q2 2027**. There are no Q1 2027 or December 2026 completion references in the current IM. Historical source records and unchanged supplied documents are retained as evidence rather than rewritten.

## Headshot — awaiting usable source file

The requested photo is visible in the conversation, but this turn supplied no downloadable file identifier or workspace image for it. The attachment directories contain the earlier schedule, brief and ZIP assets; none contains the new headshot. The exact JPEG/PNG has been requested. No substitute, generated portrait or broken placeholder has been added. The existing footer and contact details are preserved pending that file.

When supplied, add the exact image to the existing agent contact area at a restrained portrait size, using CSS cropping and responsive spacing. Re-run the six-width checks, capture the contact area and update this report before claiming the headshot requirement complete.

## Review preview and evidence

An updated self-contained review copy is available in this workspace at `/workspace/fern-review/FERN-founder-preview.html`. Open that HTML file in a browser; the logo is embedded and the PDF is an absolute HTTPS link. No public hosted preview has been created, and no existing site has been deployed or changed. A founder-hosted preview cannot be checked until its URL is supplied.

The current browser evidence is recorded in `docs/qa/founder-results.json`. The test suite compares nine preserved regions against PR commit `4bbae04`: five gallery regions including corrected Entry/Dining, the materials section, floorplans/tables, sales cards and location. It also checks every existing contact link, all 75 entries, the disclaimer, typography, overflow, contrast, floorplan tabs, all original images, builder naming and all three completion references. The complete floorplan region and original interaction script remain byte-identical.

This remains a draft PR with the headshot item explicitly outstanding. No merge or deployment is performed.
