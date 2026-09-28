# Opening contact request

The founder requested name and email collection at the start of chat for follow-up, with an explicit promise that Sanifu will never sell visitor information or spam visitors.

The connected website greeting asks immediately. The backend prompt replaces the old prohibition on collecting contact details, asks only for missing details, and respects a refusal. Sharing remains optional. Details remain in the existing saved transcript and its owner email copies; no new contact database, newsletter enrollment or automatic outreach was added. Website and backend privacy copy explain the processing and retention of contact details.

Validation: Go race tests and vet passed. The new API regression verifies the outgoing contact-request instructions and saved contact text; it fails against the old prompt. Existing retrieval tests pass. Browser fixture checks covered the opening at 390px and 1440px, Enter submission, literal HTML-like text, restore after reload, and a stopped-backend error with a retry action. These predeployment checks used no live provider calls. The founder subsequently authorized deployment; the backend image is pinned in the chat repository’s Pulumi production configuration. Release verification is recorded in the chat deployment record.
