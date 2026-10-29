# Sanifu website

Static HTML, CSS and JavaScript for [sanifu.run](https://sanifu.run). The public pages present the same Zati Agency workshops as [zati.agency](https://zati.agency): private, hands-on work on a website, phone inquiries, or a recurring workflow. Prepared workshop answers, a manual brief download, and the free discovery-call link remain available while the AI backend is disconnected.

## Local preview

Run `python3 -m http.server 8790 --bind 127.0.0.1` and open `http://127.0.0.1:8790/`.

The production `config.js` keeps `chatEndpoint` empty. The page shows prepared answers to the published Zati questions. These are labeled as prepared text and do not create a conversation or send data. For synthetic browser checks, run the opt-in fixture described in `../chat/README.md` and create ignored `config.local.js` with `window.SANIFU_CONFIG = { chatEndpoint: 'http://127.0.0.1:8791/api/ask', bookingUrl: 'https://calendly.com/david-sire/30min' };`. Remove the local override when finished. No API secret belongs in browser files. Do not point the public page at the previous Sanifu coaching API; that service still describes the retired offer.

The background uses the existing video URL from the preserved template. Desktop mouse movement scrubs the video; touch and reduced-motion users see a still frame. Failed video loading falls back to the static crimson background. The existing infrastructure scripts remain optional and require separate authorization for rehosting and spend. The page keeps the Sanifu visual identity. Offer and price copy follows zati.agency.

The composer stays visible offline. Enter sends; Shift+Enter adds a line. Prepared questions receive labeled local answers; other questions receive an explicit unavailable response and are not transmitted or persisted. Privacy is linked only in the footer. Further questions, workshop details, saved chats and the manual brief are under More options.

## Chat contract

When a qualified endpoint is set, the website uses that service's `/api/ask`, `/api/conversation`, `/api/conversation/title`, `/api/brief` and `/api/booking` routes. Messages use a browser-held recovery token. A visitor can edit and approve only the exact saved brief version. A later message requires a new review. Visible book buttons open the Zati Calendly page. The older in-chat Cal.com slot picker remains in `assets/chat.js` for a saved booking on a connected conversation; it is not the public booking path.

Before setting the public HTTPS `chatEndpoint`, verify the backend URL, exact-origin CORS, storage isolation, owner authentication, answer quality against `docs/brand.md`, retention, and booking behavior. The static site must keep the unavailable state until those checks pass. The sibling brain and chat repositories referenced by earlier notes are not in this checkout.

## Publishing

The GitHub repository is `sanifu-run/sanifu.run`. Publish from `main` at the repository root with GitHub Pages and the included `CNAME`. Cloudflare holds DNS for `sanifu.run`; verify Pages, custom-domain and HTTPS status after changing records. The local `docs/design/v1` reference and earlier unused brand files are preserved but excluded from the public repository. No build service or paid website infrastructure is needed.

## Interactive workshop page

`/workshop/` is a teaching map, not a paid package. It presents a future-of-software vision through five familiar 3D stations: People, Headless core, Agents, Human rules and Improvement. Its eight chapters provide a 30-minute presenter route. Click a station to follow the story; “Explore this idea” exposes the related concepts, engineering decisions, failure examples and primary-source context. All 34 deeper concepts and their relationships remain available in the teaching panel, including separate workflow and code/feature improvement loops. `?graph=full` opens the presentation; `&notes=1` opens presenter notes. Left/right arrows change chapters; Escape exits the full-page graph. Phones and reduced-motion viewers start with flat station cards; explicit choices and selected chapters/concepts persist in the URL. A static summary remains available without JavaScript or if modules fail. The map is a teaching architecture, not a running agent service. Workshop outcomes remain project-scoped. No build step or additional hosted dependency is required.


## Interactive Atlas

`/atlas/` explores David's public repositories as white 3D spheres against Sanifu crimson. Search by name or owner, click linked year nodes to filter, and choose **All years** to return to the overview. Sphere sizes follow commit counts and language artwork identifies the dominant language. Browse list provides a text alternative. Shift-drag/right-drag pans, drag rotates, and scroll zooms; touch uses one finger to rotate and two to pan/zoom. Source and rebuild instructions: `tools/atlas/` and `docs/atlas-2026-10-02.md`. This is a static snapshot; the site does not make live GitHub API requests.

### Workshop narration

The workshop graph includes short synthetic narration for every chapter, deeper
concept, and illustrative improvement step. Selecting an idea starts its clip;
use the play/pause and replay icons, or the speed selector. Turn off
“Narrate on selection” for manual playback. Loading the page starts silently. A readable transcript is
available alongside the player, including when audio is unavailable.

Spoken copy is in `workshop/narration-scripts.js`; the corresponding mono MP3s
are in `workshop/audio/`. These are static assets with no TTS API or browser
speech dependency. The synthetic voice is cloned from David’s supplied reference,
rendered with Narrate’s Pocket TTS backend on his DGX through Spark. The reference
stays private; only the finished narration clips are served by the site. When
changing a script, regenerate its matching clip and verify script IDs against
`workshop/content.js`.

## Current audience and offer

Zati Agency workshops for business owners and teams. A visitor brings a website and one task. The free 30-minute discovery call includes an AEO and GEO site audit report and a relevant demo, kept whether or not they book. Published starting prices, in USD per business, are $500 for 2 hours, $1,000 for 4 hours, $2,000 for 8 hours, $3,600 for 16 hours, and $6,400 for 32 hours. A written scope and quote come before payment. See `docs/brand.md`. Do not promise rankings, citations, revenue, or a complete setup in every package. The Atlas and `/workshop/` concept map are exhibits, not packages.
