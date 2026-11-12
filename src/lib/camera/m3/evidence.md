# Leica M3 teardown: evidence

Use: an interactive explanatory model on the photography page. It is not a
manufacturing drawing. Output size: the page stage, 320–470 px tall.

| Feature group | Evidence | How the model uses it |
| --- | --- | --- |
| Body 138 × 77 × 33.5 mm, rounded ends | Published dimensions | Preserved |
| Flange distance 27.8 mm (film plane) | M-mount specification | Preserved |
| Rangefinder base 68.5 mm, 0.91× finder | Published figures | Preserved; mirror swing drawn ×3 |
| Window order (finder, frameline, rangefinder) | Product photographs | Positions estimated |
| Top controls: rewind knob, shoe, speed dial, release, lever | Product photographs | Positions and sizes estimated |
| Shutter speeds 1 s to 1/1000 s, horizontal cloth curtains | Published specification | Curtain travel slowed for viewing |
| 135 film: 36 × 24 mm frame, 38 mm pitch, 8 perforations | Film standard | Preserved |
| 50 mm lens, 0.7 m close focus; f/2–f/16 as a Summicron, f/1–f/1.4 as a Noctilux or Summilux | Published specifications | Helicoid travel from f²/(d − f); one lens model for all f-stops |
| Lens element shapes, 10-blade iris | Hidden construction | Illustrative double-Gauss sketch |
| Gear train, roller linkage, drums, sprocket, spools | Hidden construction | Illustrative |
| Scene, exposure and blur in the viewfinder and prints | Concept | Thin-lens blur (0.03 mm circle of confusion), EV 12 at ISO 100 scene, gulls at 8 m/s and 14 m, Tri-X reciprocity and latitude (−3.2 to +6.5 stops), lab print that corrects 75% of an error up to 3 stops, 0.03 rad/s hand shake |

Omitted: self-timer mechanism, film-reminder dial, slow-speed escapement,
B setting, frame-counter reset linkage.

## Rebuild and check

- `npm test` runs `src/lib/cameraOptics.test.js` (focus, blur, exposure, slit, roll math).
- `npm run dev`, then open `/photography`. Check the assembled, exploded and X-ray views
  in both site themes, and one full roll cycle: wind, release, rewind, load.
