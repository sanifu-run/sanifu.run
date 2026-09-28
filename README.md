# Sanifu website

Static HTML, CSS and JavaScript for [sanifu.run](https://sanifu.run). The primary page uses the founder-approved Sanifu logo and a chat for exploring software and ML workshop ideas. Privacy, manual brief download and direct free-call booking remain available when the AI backend is unavailable.

## Local preview

Run `python3 -m http.server 8790 --bind 127.0.0.1` and open `http://127.0.0.1:8790/`.

The production `config.js` starts with an empty `chatEndpoint`; it shows an honest unavailable state. For synthetic browser checks, run the opt-in fixture described in `../chat/README.md` and create ignored `config.local.js` with `window.SANIFU_CONFIG = { chatEndpoint: 'http://127.0.0.1:8791/api/ask' };`. Remove the local override when finished. No API secret belongs in browser files.

## Chat contract

The website uses the Sanifu chat service's `/api/ask`, `/api/conversation`, `/api/conversation/title`, `/api/brief` and `/api/booking` endpoints. Messages use a browser-held recovery token. A learner can edit and approve only the exact saved brief version. A later message requires a new review. Cal.com booking has a separate review and confirmation step; the page also links directly to the free call.

Before setting the public HTTPS `chatEndpoint`, verify the Sanifu backend's URL, exact-origin CORS, storage isolation, owner authentication, provider answer quality, retention and booking behavior. The static site must keep the unavailable state until those checks pass. See `../brain/docs/rfc/001-sanifu-guided-workshops.md` for the offer and launch gates.

## Publishing

The GitHub repository is `sanifu-run/sanifu.run`. Publish from `main` at the repository root with GitHub Pages and the included `CNAME`. Cloudflare holds DNS for `sanifu.run`; verify Pages, custom-domain and HTTPS status after changing records. The local `docs/design/v1` reference and earlier unused brand files are preserved but excluded from the public repository. No build service or paid website infrastructure is needed.
