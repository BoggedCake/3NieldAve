# Architectural image presentation audit

Baseline: fetched feature branch `feat/fern-finishes-shore` at `bb4f7b17b6131168328e63ef67a52b43718c11e0`. Every original embedded architectural image was extracted, opened and reviewed in a labelled contact sheet before implementation. Pixel dimensions, byte counts and original SHA-256 values are retained in [image-inventory.json](image-inventory.json). The source image bytes are unchanged.

| Image / original location | Native pixels / ratio | Hierarchy and subject | Features that must remain visible | New presentation |
| --- | --- | --- | --- | --- |
| Exterior / cover background | 1280 × 1280 / 1.000 | Primary: complete street elevation | Both residences, balconies, battens, planting, driveway and street-level arrival | Complete square; image and cover information share desktop opening; header/image/information stack below 1024px |
| Harbour Views / after overview | 1800 × 1200 / 1.500 | Primary: location and outlook | Harbour, surrounding neighbourhood, foreground trees and distant ridge | Uncropped feature, capped at 1280px; native proportions on mobile |
| Living Room / gallery hero | 1800 × 1200 / 1.500 | Primary: main living and exterior connection | Seating arrangement, doors, terrace/outlook, full room depth | Dominant natural-ratio image, capped at 1360px |
| Kitchen / previous equal pair | 1800 × 1199 / 1.501 | Primary: island, joinery and stone | Whole island, stools, appliances, cabinetry and skylight | Leads the kitchen/family dialogue; natural-ratio equal-width pair justified by matching source compositions; full width on mobile |
| Family Room / previous equal pair | 1800 × 1199 / 1.501 | Secondary: informal entertaining | Seating, fireplace, curved architectural wall and external glazing | Follows Kitchen; equal natural composition on desktop, distinct full-width image on mobile |
| Entry / Entry–Dining pair | 1800 × 2250 / 0.800 | Primary arrival, portrait | Complete stone surround, door, stair and landscaping | Native portrait; desktop ratio-based pairing; tablet gives portrait a broader share; mobile capped at 320px |
| Dining / Entry–Dining pair | 1800 × 1011 / 1.780 | Primary: connected dining/kitchen volume | Full dining setting, stone island, wall art, skylight and rear outlook | Native wide composition, paired with Entry; full-width mobile landscape |
| Master Bedroom / previous wide hero | 1800 × 1199 / 1.501 | Secondary: private residence | Entire bed, wall feature, window and joinery | Centred, uncropped feature capped at 1080px, subordinate to Living |
| Powder Room / previous equal pair | 1800 × 2571 / 0.700 | Editorial detail: stone vanity and lighting | Basin, mirror, sconce, toilet and floor | Portrait share of asymmetric bathroom pair; mobile width 76%, capped at 260px, avoiding an oversized full-width detail |
| Ensuite / previous equal pair | 1800 × 1384 / 1.301 | Secondary: bathroom architecture | Vanity, mirror, shower/window, bath and floor | Wider natural-ratio share of bathroom pair; full-width mobile landscape |

All ten architectural compositions use their complete native frames. No architectural crop or focal-point substitution is required. The only deliberate cover crop retained elsewhere is the separately approved agent portrait CSS treatment, which is not an architectural render. Johinke's CSS removes transparent logo margins only; SHORE's supplied artwork stays inside the approved white inset.

## Editorial sequence and responsive rules

The cover opens with the entire exterior rather than a viewport-shaped crop under a dark overlay. The existing overview and harbour/outlook lead to the residences copy, followed by Living → Kitchen/Family → Entry/Dining → Bedroom → Powder/Ensuite. Descriptive captions repeat the existing image identities; no property claims are introduced.

The publication canvas is capped at 1600px. Interior image groups have independent 1360 / 1280 / 1080 / 960px limits, creating a hierarchy rather than allowing every render to expand with the browser. Gutters and group spacing use bounded fluid values. Desktop and laptop compositions use native-ratio columns; tablet changes the Entry/Dining balance without cropping; mobile uses distinct primary landscapes and restrained portrait details, with deliberate 28px pair spacing and larger breaks between narrative groups.

## Delivery and integrity

The existing JPEG masters are already 1800px wide or smaller. They remain embedded to preserve the functioning HTML-only review artifact and eliminate sibling-path failures. External responsive variants would introduce a deployment/build dependency and make the self-contained artifact materially different; they are not introduced in this pass. No mobile transfer reduction is claimed: embedded bytes still travel with the HTML. Native width/height attributes reserve layout space, while below-fold architectural images use lazy loading and asynchronous decoding to reduce eager decode/paint work. No destructive recompression, replacement imagery or new application dependency is added.

The entire original floorplan region, area tables, contact markup, partner artwork, finishes, completion target and commercial/legal copy remain unchanged. Source comparisons and the functional suite verify these independently of gallery geometry.
