# Atlas design QA

Source visual truth: `atlas-before.png` in the isolated Atlas refinement worktree, captured from the approved repository-only, white-sphere prototype. Final implementation: `qa-artifacts/atlas-refined-desktop.png` and `qa-artifacts/atlas-refined-mobile.png`. Both source and final desktop captures are 1289×1080 CSS/pixels, density 1. Mobile captures are 390×844, density 1, clipped to the responsive viewport. The before/after desktop images were viewed together in the same comparison input.

## Findings and fixes

- [P2, fixed] The initial mobile overview tinted white spheres crimson through distance fog. Moved the fog range outward; the final mobile overview keeps the language artwork on white spheres.
- [P2, fixed] The initial mobile repository focus was oversized and overlapped the detail card. Increased portrait focus distance and shifted the camera target; the final AMOS mobile capture shows the gopher above its readable detail card.
- [P2, fixed] Scene nodes behind bottom instructions could reduce contrast. Added dark translucent instruction and credit backings.

## Fidelity surfaces

- Typography: retained the system sans-serif stack, with a deliberately smaller header and stronger repository-title hierarchy. This is an authorized refinement, not a recreation of the oversized prototype heading.
- Spacing/layout: compact header, fully fitted overview, linked timeline, rounded details, persistent zoom/reset controls, and mobile horizontal year scrolling. Viewport overflow check at 390px returned false.
- Color/tokens: Sanifu crimson, white sphere surfaces and approved logo, translucent dark panels, gold focus/selection states.
- Image quality: approved Sanifu PNG and existing locally served language artwork preserved. Sharp gopher confirmed in desktop and mobile close-ups. Doubled commit-scaled radii, real sphere geometry, and foreground labels retained.
- Copy/content: clear Atlas title, public-repository counts, year counts, source links, desktop and touch gesture help. List browsing provides readable text and source links.

## Interaction evidence

2011 filters to legacy (one repository); 2026 shows 50; All years restores 156. Search opens AMOS with Go, its date, 213 commits, and its gopher. List view respects the active year. Zoom in/out and Reset view respond; normal browser console reports no errors. A separate static preview returned HTTP 503 for atlas.json and displayed the repository-data error with disabled search. Assets, licenses, bundle paths, homepage link, snapshot types/commit counts/dates and unique IDs pass the static verifier.

Focused captures: `qa-artifacts/atlas-detail-desktop.png` and `qa-artifacts/atlas-detail-mobile.png` verify language-art sharpness and detail readability. Pixel size checks identify browser captures as JPEG data despite their .png filenames; no density scaling was applied. No remaining actionable P0/P1/P2 findings. WebGL failure fallback is implemented but not simulated; mobile touch gestures were documented from the configured OrbitControls mapping, not exercised on a physical touchscreen.

Final result: passed

## Founder attribution and full names

Verified the explicit “Repositories started by David Ndungu” header and “156 repositories I started” count. Node labels, search results, selected details, and list rows show git-org/repo-name. AMOS is ajent-social/AMOS; the 2011 list shows dndungu/legacy. At 390×844 the visible node labels contain full names and the page has no horizontal overflow. Long labels wrap. Build, static integration verifier, and git diff --check pass. Final result: passed.
