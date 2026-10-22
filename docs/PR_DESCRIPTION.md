# Preserve the current FERN IM, integrate finishes and apply founder review fixes

The GitHub page was behind the live IM. Recover the deployed source first, preserving the expanded gallery and all original floorplans/area tables, then add the complete builder finishes schedule and exact supplied SHORE artwork. Founder review subsequently updates all three completion references to Q2 2027 and standardises builder copy to SHORE Projects.

The enhancement adds restrained material highlights and eleven accessible expandable categories covering all 75 inclusions, with the original disclaimer and a link to the supplied PDF. Entry and Dining now show their complete original renders without stretching or cropping. Corrects the oak/ash conflict, removes unsupported architectural attribution to SHORE and fixes the existing mobile overview-grid overflow.

Founder review fixes: embed the supplied JPEG's exact bytes so it also works in HTML-only previews; replace the relative PDF link with a direct PDF served from the existing fixed repository commit, opening in a separate tab. The former relative links reproduced 404s when previews omitted sibling assets. Source PDF bytes and response type have been verified.

Further founder refinement: keep the SHORE Projects tile black and place its unchanged logo within a deliberately padded white inset. Enlarge the Johinke Developments mark materially, restore the original white artwork by removing its former inversion, and hide only its transparent margins with CSS. Matching brand spaces balance the pair on desktop, with stacked layouts on mobile. Representative updated screenshots are linked from `docs/FOUNDER_REVIEW.md`.

Validation: browser checks at 375, 430, 768, 1024, 1440 and 1920 pixels; exact original floorplan/script and image-source preservation; nine unchanged visual regions per width; all inclusions, asset checksums, keyboard details, new text contrast, links, PDF, image decoding, overflow and page errors. All 75 entries also appear in print output. Representative framing comparisons and full findings are in `docs/QA.md`.

Founder/builder confirmation remains necessary for Doroch architect credit and marketed features not independently documented in the finishes schedule. Existing sales evidence, construction-progress statements and areas are retained from the live IM; completion is updated to Q2 2027 under founder instruction. Marketing floorplan replacement is excluded until verified plans arrive. See `docs/IMPLEMENTATION.md` for details and replacement locations.

Headshot source blocker resolved: the supplied web-optimised Chris Lewis JPEG is embedded unchanged in the contact footer. A restrained 170px portrait sits beside the agent details on desktop/tablet and stacks at 132px on mobile. All existing contact text, enquiry link and Stone branding remain. Tests explicitly verify presence, exact bytes, decoding, visibility, unobscured placement and responsive geometry at all six widths. Actual desktop/mobile footer screenshots and source checksums are recorded in `docs/FOUNDER_REVIEW.md`. Keep this PR in draft for founder review.

Review only. Do not merge or deploy without founder approval.
