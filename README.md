# Sanifu website

Static HTML, CSS and JavaScript for [sanifu.run](https://sanifu.run). The primary page uses the founder-approved Sanifu logo and a chat for exploring software and ML workshop ideas. Privacy, manual brief download and direct free-call booking remain available when the AI backend is unavailable.

## Local preview

Run `python3 -m http.server 8790 --bind 127.0.0.1` and open `http://127.0.0.1:8790/`.

The production `config.js` starts with an empty `chatEndpoint`; it shows an honest unavailable state with prepared quick answers to common first questions. These are labeled as prepared text and do not create a conversation or send data. For synthetic browser checks, run the opt-in fixture described in `../chat/README.md` and create ignored `config.local.js` with `window.SANIFU_CONFIG = { chatEndpoint: 'http://127.0.0.1:8791/api/ask' };`. Remove the local override when finished. No API secret belongs in browser files.

The background uses the existing video URL from the preserved v1 template, as requested for this design revision. No new video hosting has been provisioned. Desktop mouse movement scrubs the video; touch and reduced-motion users see a still frame. Failed video loading falls back to the static crimson background. The existing infrastructure scripts remain optional and require separate authorization for rehosting and spend.

The composer stays visible offline. Enter sends; Shift+Enter adds a line. Prepared questions receive labeled local answers; other questions receive an explicit unavailable response and are not transmitted or persisted. Privacy is linked only in the footer. Further questions, workshop details, saved chats and the manual brief are under More options.

## Chat contract

The website uses the Sanifu chat service's `/api/ask`, `/api/conversation`, `/api/conversation/title`, `/api/brief` and `/api/booking` endpoints. Messages use a browser-held recovery token. A learner can edit and approve only the exact saved brief version. A later message requires a new review. Cal.com booking has a separate review and confirmation step; the page also links directly to the free call.

Before setting the public HTTPS `chatEndpoint`, verify the Sanifu backend's URL, exact-origin CORS, storage isolation, owner authentication, provider answer quality, retention and booking behavior. The static site must keep the unavailable state until those checks pass. See `../brain/docs/rfc/001-sanifu-guided-workshops.md` for the offer and launch gates.

## Publishing

The GitHub repository is `sanifu-run/sanifu.run`. Publish from `main` at the repository root with GitHub Pages and the included `CNAME`. Cloudflare holds DNS for `sanifu.run`; verify Pages, custom-domain and HTTPS status after changing records. The local `docs/design/v1` reference and earlier unused brand files are preserved but excluded from the public repository. No build service or paid website infrastructure is needed.

## Interactive workshop page

`/workshop/` explains the six-step method with a rotatable, selectable process map and a booking-request teaching illustration. The homepage links to it from the offer. `?graph=full` opens the focused graph with a selected-step teaching panel; the flat view, keyboard navigation and static summary provide alternative ways to follow the process. Phones and reduced-motion viewers start with the readable flat map and can choose 3D; an explicit view choice persists in the URL. The tool map describes an illustrative workflow and evolving components, not a live service integration. No build step or additional hosted dependency is required.


## Interactive Atlas

`/atlas/` explores David's public repositories as white 3D spheres against Sanifu crimson. Search by name or owner, click linked year nodes to filter, and choose **All years** to return to the overview. Sphere sizes follow commit counts and language artwork identifies the dominant language. Browse list provides a text alternative. Shift-drag/right-drag pans, drag rotates, and scroll zooms; touch uses one finger to rotate and two to pan/zoom. Source and rebuild instructions: `tools/atlas/` and `docs/atlas-2026-10-02.md`. This is a static snapshot; the site does not make live GitHub API requests.
