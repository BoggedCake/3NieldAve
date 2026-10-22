Current responsive editorial evidence: [QA and before/after screenshots](editorial/QA.md). Earlier founder review records follow.

# Founder review revisions

Continues draft PR #1 on `feat/fern-finishes-shore`. The latest partner-presentation pass uses commit `c0a6ee1` as its baseline. No IM rebuild, floorplan change, merge or live deployment.

## Partner presentation refinement

The SHORE Projects tile retains its `#111` background. Its exact supplied JPEG sits inside a white inset panel, with 26px vertical / 28px horizontal padding and a restrained maximum panel width of 380px. The artwork is not recoloured or recreated. The logo spaces in both tiles share a 190px minimum height so the brand presentations and following copy align as a pair on desktop.

The embedded Johinke Developments PNG is unchanged. Its previous `filter:invert(1)` turned the original white lettering black, and a 72px-tall image box included extensive transparent margins. The new treatment removes that inversion and uses CSS to hide only those transparent margins. Visible lettering is now up to 360px wide, approximately four times its former visible width, while retaining the original artwork and aspect ratio. Mobile tiles stack with matching whitespace and no overflow.

Partner presentation results are in `docs/qa/partner-results.json`, with representative [desktop](qa/partner-1440.png) and [mobile](qa/partner-375.png) screenshots. Checks assert the black builder tile, white inset, padding, original SHORE artwork checksum, legible original Johinke artwork and a visible Johinke mark at least 2.5 times larger at every tested width. The existing PDF, Q2 2027, SHORE Projects wording, all 75 finishes, image framing and plan checks remain active.

## Logo and PDF diagnosis

Both files were present and valid in Git. The problem reproduced when the HTML was displayed independently of the repository asset directory: `assets/shore-logo.jpg` and `assets/fern-finishes-inclusions.pdf` resolved relative to the preview document and returned 404. The earlier tests served the complete checkout and therefore did not catch that preview packaging dependency. The precise founder-hosted preview URL has been requested; no linked deployment or preview checks are attached to PR #1.

The logo now embeds the exact supplied JPEG as a data URI, consistent with the original IM's embedded images. Its decoded checksum is tested against the supplied artwork. There is no font approximation, artwork alteration or separate logo request to fail.

The schedule is a direct HTTPS PDF link that opens a separate tab with `noopener noreferrer`. It points to the unchanged PDF already committed in this public repository, served by jsDelivr from the fixed full commit `5b563e21da49145c26cb5892e0eaa6b734d66164`. The endpoint returned HTTP 200 and `Content-Type: application/pdf`; downloaded bytes match the supplied schedule's SHA-256. It uses no embedded viewer or relative asset path, and does not require deployment of the main site. The local PDF remains in `assets/fern-finishes-inclusions.pdf` as the source record.

The test server now deliberately serves the updated IM at a nested HTML-only preview path whose sibling asset paths do not exist. Browser tests click the actual PDF link, verify the new tab reaches the direct document, decode the embedded logo, and verify its original bytes. The established TLS-verified font-fetch adapter remains in place; the same approach supplies verified PDF bytes to Chromium where its cloud proxy trust store differs from system curl. Remote PDF bytes are fetched and checksum-verified during every viewport test.

## Text changes

All visible builder references, including the logo's accessible description, use **SHORE Projects**. The supplied artwork is unchanged and retains its original wordmark and tagline.

The cover statistic, executive-summary statistic and construction paragraph now use **Q2 2027**. There are no Q1 2027 or December 2026 completion references in the current IM. Historical source records and unchanged supplied documents are retained as evidence rather than rewritten.

## Headshot — supplied and implemented

The original and web JPEGs were extracted from `FERN_Headshot_Codex_Fix.zip` into `/workspace/fern-review/headshot-supplied`, then opened and verified as valid JPEGs. The original is 1122 × 1402 pixels, SHA-256 `69b4c594d0ff919bf61c3a0b9210af428fda938523464b924a7c02265a3d9195`. The supplied web copy is 840 × 1050 pixels, SHA-256 `451657dbd11aedcb414bc65042146468297b6fb5e9546fd95f9689fb4c168f27`.

The exact web JPEG is tracked at `assets/FERN_Chris_Lewis_Headshot_Web.jpg` and embedded directly in `index.html`. No face retouching, regeneration, colour changes or image recompression was performed. The source retains its supplied natural 4:5 proportions; the final display uses a slightly tighter CSS crop without changing image bytes. The embedded decoded bytes are checksum-tested against the supplied file.

The portrait sits beside the existing name, contact details and enquiry button in a 185 × 200px frame on desktop and tablet, top-aligned with the EXCLUSIVE AGENT label. CSS `object-fit:cover` and `object-position:center top` crop a small amount of lower torso without retouching the face, background or source image. At narrow mobile widths it moves above the contact text at 132px wide, retaining left alignment and restrained spacing. The Stone branding and all existing contact text/links remain. The overall footer stacks its contact and agency columns on tablet widths to give the contact block adequate room.

Automated checks at 375, 430, 768, 1024, 1440 and 1920 pixels explicitly require one portrait inside the agent contact area; successful decoding; nonzero natural dimensions; visible, unobscured placement within the footer; the exact supplied checksum; the approved CSS crop; top alignment with the agent label on desktop; and the appropriate desktop or mobile position and size. The HTML-only preview route has no sibling asset directory, so these checks also guard against the earlier missing-asset failure.

Final refinement evidence: [desktop footer](qa/final-footer-1440.png), [mobile footer](qa/final-footer-375.png), and `docs/qa/final-refinement-results.json`. Initial headshot evidence is retained separately. Apart from the explicitly approved editorial heading rename, the complete IM body before the footer, including the partner tiles and finishes, remains byte-identical to commit `8c7650e`; legal footer and floorplan script are unchanged.

## Review preview and evidence

An updated self-contained review copy is available in this workspace at `/workspace/fern-review/FERN-founder-preview.html`. The logo and portrait are embedded and the PDF is an absolute HTTPS link. Its bytes match the current `index.html`; the exact preview copy was served over HTTP and the portrait was verified decoded and visible. Use a static HTTP server in the managed cloud browser, whose policy blocks direct `file://` navigation. No public hosted preview has been created, and no existing site has been deployed or changed. A separate founder-hosted URL cannot be checked until supplied.

The current browser evidence is recorded in `docs/qa/founder-results.json`. The test suite compares nine preserved regions against PR commit `4bbae04`: five gallery regions including corrected Entry/Dining, the materials section, floorplans/tables, sales cards and location. It also checks every existing contact link, all 75 entries, the disclaimer, typography, overflow, contrast, floorplan tabs, all original images, builder naming and all three completion references. The complete floorplan region and original interaction script remain byte-identical.

The headshot source blocker is resolved. This remains a draft PR for founder review; no merge or deployment is performed.

## Final editorial and portrait refinement

The editorial heading is exactly “Landscaping & Pool”. Its description and surrounding layout are unchanged. The only application changes in this final pass are that heading and two portrait CSS rules. The existing outer footer grid, Stone logo markup/styles, contact details, photo bytes and 28px portrait/contact gap remain unchanged. Portrait frames retain square corners. Mobile keeps its existing stacked placement and 132px width, with the same restrained CSS crop.

Visual checks cover 375, 430, 1440 and 1920 pixels. The materials visual comparison normalises only the explicitly approved heading rename; all 75 descriptions and the schedule disclaimer remain independently asserted. Original floorplans, working direct PDF, SHORE Projects wording, Q2 2027 and image framing remain protected by the existing suite.
