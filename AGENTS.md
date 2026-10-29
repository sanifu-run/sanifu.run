# Sanifu website

Read README.md and docs/brand.md. Preserve docs/design/v1 exactly.
- Static HTML/CSS/JS on GitHub Pages. CNAME is sanifu.run; DNS is in Cloudflare. No new build service or paid infrastructure. Do not publish or alter DNS without scoped authorization.
- Keep the approved Sanifu visual identity: logo, crimson palette, system sans-serif, and the existing background video. Do not restyle the site to match zati.agency. Rewrite offer, price, claim, booking, and contact copy so it matches zati.agency. Do not restore the retired $1,200 coaching offer, the attendee discount, community access, or the old phone line.
- Do not add a registered trademark, an unlicensed font or video, or an invented testimonial.
- Chat configuration is a public endpoint only. Leave chatEndpoint empty until that service answers with the current Zati offer. No secrets, private brain content, transcripts, or internal targets in published files.
- Prepared answers in assets/chat.js are the knowledge this site can state while the assistant is offline. Keep them aligned with docs/brand.md.
- The AI intake, when connected, creates a visitor-approved brief only. David agrees scope in writing after the free discovery call. No automated quote or enrollment.
- The public booking link is https://calendly.com/david-sire/30min. Do not send new visitors into the retired Cal.com Sanifu scope event.
- Keep config.local.js ignored.
- Verify desktop and mobile rendering, keyboard controls, plain-text output, and real error states.
