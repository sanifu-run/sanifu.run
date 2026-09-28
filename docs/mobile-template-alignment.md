# Mobile and template alignment — 28 September 2026

The requested revision restores the preserved v1 template’s video URL, glass treatment, typography, bubble widths, spacing, fading message stream, arrow asset and composer geometry. The approved production logo stays in place. The reference directory was not edited. Existing branch work was reconciled with the locally available origin/main, preserving prepared answers, privacy fixes, booking tags and title handling.

## Decisions

- Header and chat use one gutter: 20 CSS pixels below 640px and 32 above. Chat width is capped at 560px.
- Privacy appears once, in the footer. Workshop information, prepared questions, manual brief and connected controls live under More options.
- The offline composer remains usable. Exact prepared questions receive local answers; unknown questions receive an explicit unavailable response. Neither is submitted or persisted. No demo visitor conversation is fabricated to fill the template’s sample bubbles.
- Enter submits, Shift+Enter inserts a line, and IME composition is respected. Escape cannot dismiss the always-open page chat. Forms remain inert until their handlers are installed.
- The template’s existing CloudFront video URL is configured at the founder’s explicit request. No new hosting, rehosting, public release, DNS change or spend occurred. This implementation is not evidence of video publishing rights.
- Small-height viewports reduce the stream and fade to retain access to the composer. Native mobile keyboard behavior still requires a physical-device check.

## Verification

Chrome viewport checks passed at 320×568, 390×420, 390×844, 1024×768, 1440×900 and 2880×1800: visible composer, identical logo/composer left coordinate, and no horizontal page overflow.

At 390×844 the reference and implementation composer rectangles both measured x=20, y=624.203125, width=350, height=73 CSS pixels. The production logo and real/offline conversation content intentionally differ from the template’s logo and sample transcript, so this is component/layout fidelity rather than an assertion that entire screenshots are identical.

Browser checks covered the loaded template video, footer-only Privacy link, offline submission, literal HTML input, Shift+Enter, Enter, Escape, expanded controls, connected synthetic replies, literal HTML in replies, an actual local HTTP 503 and its retry control. The local fixture did not contact an AI provider or change production endpoint configuration. JavaScript syntax and git whitespace checks passed. Screenshots were visually reviewed on mobile and desktop.
