# Sanifu name origin

Founder requested a small page section explaining his choice of Sanifu: proper, standard, and artful in Swahili, reflecting the values he embodies in his engineering practice and wants to share with the world.

Added “Why Sanifu?” before the portfolio. Connected and prepared-answer greetings say “My name means…” and attribute the choice to David. The sibling chat backend's introduction policy and public about source carry the same explanation.

Validation: JavaScript syntax and both repository diff checks passed. Browser checks at 390, 1024 and 1440 pixels found no horizontal overflow. Both greetings render as text; Enter submission preserves the offline notice and a local HTTP failure displays the retry action. Backend package race tests and vet passed using fake providers. No live model calls, publication, deployment or DNS changes.

## Deployment

Founder subsequently authorized deployment. Website content commit `defab19` passed GitHub Pages; public HTML, CSS and JavaScript byte-match the local source. A fresh live chat displays the name-origin greeting, and the page shows the founder explanation.

Chat main source is `b74b26c`. The deployed application source is isolated release `afba624`, based on the currently deployed request-metadata baseline `d1290bc`, with only the name prompt and about-source changes. Unrelated setup and analytics development was excluded. Race tests, vet, ARM64 build and local container health/unconfigured-error checks passed.

Immutable backend image: `sha256:f363ff182e0155a32b7a79ed8e85398bc26a2dfdb366987de6c80f7f9f136ca4`. Existing CA and Lambda adapter layers were retained. AWS accepted dry-run and revision-guarded image-only update; live function is Active/Successful, resolves to that digest, and retains its stable configuration. Public health reports eleven documents with AI and transcripts configured.

Pulumi targeted refresh update 14 reconciled the image metadata. Before/after checkpoint comparison confirms the same resource set and only the chat function changed, apart from removal of empty dependency lists. Source image pin matches. No cloud resources, mail code, DNS or configuration were altered; no live model calls or bookings were made.
