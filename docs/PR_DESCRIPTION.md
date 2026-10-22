# Preserve FERN architecture and use the approved floorplans

The responsive editorial gallery preserves complete architectural frames across phone, tablet and ultrawide. The final correction embeds the exact approved 2D and 3D PNGs and replaces the fixed-width hero overlay with image-relative transparency masks: horizontal on desktop, vertical on mobile. Neither architectural image masters nor supplied floorplan pixels are modified.

Both sheets contain every floor, so the established styled tabs and unchanged switching script now select 2D Floorplan / 3D Floorplan. All three existing floor descriptions and residence tables remain. The approved 2D label is Living/Lounge; both numerical internal/external note blocks are absent. Old embedded plan payloads are removed, and the exact new bytes are self-contained in the HTML with no image-path cache dependency.

Preserved: approved gallery imagery/order/styles, SHORE Projects and Johinke branding, agent portrait/footer, eleven finishes categories and all 75 entries, working PDF, Landscaping & Pool wording, Q2 2027 timing, property and legal copy.

Validation: Chromium checks pass at 390, 430, 768, 1440, 1920 and 2560px, plus 19 continuous resize samples and print. Exact plan hashes, decoded native proportions, both tabs, old-payload removal, image clipping/overflow, contacts, PDF and finishes pass. Actual hero PNG pixels meet navy at the image boundary within 0–1 RGB levels, including an expanded 900px hero. Local rendered hero and plan screenshots are visually inspected separately from automated results.

- [Current correction QA and actual screenshots](docs/correction/QA.md)
- [Exact approved plan hashes](docs/correction/floorplan-checksums.json)
- [Approved editorial image audit](docs/editorial/IMAGE_AUDIT.md)

The branch push intentionally has no deployment skip directive. The latest Vercel Preview identifier/status and any remaining live-browser access restriction are recorded in the PR update. Local testing is not presented as live visual verification. Keep PR #1 in draft for founder review; do not merge or deploy to Production.
