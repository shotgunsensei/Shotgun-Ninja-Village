# Merch production handoff — approval required

Status: **concept previews only**. No manufacturing listings or fulfillment configuration changed. The generated 1,254 × 1,254 source images contain garments/backgrounds; they are not isolated printable graphics. At 300 ppi the entire source would cover only 4.18 × 4.18 inches, with substantially less usable artwork. Enlarging these mockups does not establish print readiness.

| Existing item              | Proposed artwork box for approval      | Raster target at 300 ppi               | Next production requirement                                                                        |
| -------------------------- | -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Signal Hunter Tee          | Front 12 × 16 in                       | 3600 × 4800 px                         | Isolate/rebuild split-ring print; approve blank, color, placement and ink method                   |
| Kage-9 Operator Hoodie     | Front 10 × 12 in                       | 3000 × 3600 px                         | Original isolated Kage-9 illustration; approve pocket/seam clearance and garment template          |
| Fracture Scan Drop Tee     | Front 12 × 16 in                       | 3600 × 4800 px                         | Rebuild industrial panel as print art; verify detail at smallest garment size                      |
| Village Signal Cap         | Front emblem 3.5 × 2 in                | Vector source; 1050 × 600 px proof     | Approve actual cap embroidery area, simplified stitch art, thread colors, digitization and sew-out |
| Tactical Sticker Pack      | Six individual 3 × 3 in maximum shapes | 900 × 900 px each, before vendor bleed | Separate each graphic, vector cut paths, white borders, bleed and safe zone from chosen template   |
| Founding Ninja Tee         | Front 12 × 16 in                       | 3600 × 4800 px                         | Rebuild village gate/banner as clean print graphic; no unapproved run/numbering claim              |
| Forge Protocol Long Sleeve | Back 12 × 16 in; sleeve 2 × 10 in      | 3600 × 4800; 600 × 3000 px             | Separate back/sleeve art; approve blank and sleeve placement template                              |
| Noise Sector Poster        | Existing source size label: 18 × 24 in | 5400 × 7200 px without bleed           | Original 3:4 print master; selected vendor supplies bleed, margin and color-profile requirements   |

These are explicit **proposed design boxes**, not verified vendor print areas. The poster size is the existing preview variant. No blank garment model, vendor SKU, embroidery template, stitch limits, bleed, ICC profile or safe-zone dimensions were provided; those must be approved before exports or listings. Keep vector marks editable; use isolated transparent-background raster artwork where required; preserve source prompts and hashes. Text must be outlined or embedded for final production. Physical sampling/garment fit, paper, ink, color and stitch approval remain outstanding.

Previews: `artifacts/shotgun-ninja-village/public/brand/merch/*.webp`.
Raster originals: `docs/design/raster-source/*.png`.
Owned vector marks: `artifacts/shotgun-ninja-village/public/brand/signal-crest.svg` and `factions/*.svg`.
Provenance and exact dimensions: `docs/design/asset-manifest.json`.

The new web catalog labels these as design concepts and closes demo checkout. Live Shopify images are used unchanged; missing live imagery is shown as unavailable. Existing prices, variants and SKUs remain unchanged.
