# Chat activation — 28 September 2026

Superseded for the public site on 2026-10-29. `config.js` now sets an empty `chatEndpoint` because the deployed assistant still answers from the retired Sanifu coaching offer. The previous public endpoint was `https://vg78ulztb1.execute-api.us-west-2.amazonaws.com/api/ask`. Do not restore it until its answers match `docs/brand.md`. Storage, email, and brief behavior below remain the contract for a future qualified endpoint. The sibling chat repository is not in this checkout.



The founder authorized an AWS backend managed with IaC, a $50 AWS monthly budget, a $100 Experiential AI budget, 30-day AWS transcript retention, and emailed transcript copies. The founder confirmed the AI budget was configured and the owner inbox was verified.

On 28 September 2026, `config.js` pointed at the qualified Sanifu HTTP API. It contained only a public endpoint and the existing template video URL. Credentials remained server-side in Secrets Manager. `docs/design/v1` was unchanged. The AI phone link from site main `42991e2` was on the page then. That link was removed on 2026-10-29 and must not be restored.

Public privacy copy and the visible chat status disclose emailed transcripts. The 30-day expiry applies to AWS transcripts from their last update; it does not erase email copies or Experiential captures, which currently have no fixed expiry. The delete confirmation describes these limits. Gateway throttling and AWS budget alerts are not hard monetary ceilings.

Before activation: 20 buyer-question replies and eight multi-turn scenarios reviewed with no critical failures; live saved conversations, titles, briefs, exact-version approval, rejected stale approval, owner access, deletion, CORS and actual TTL checked. SES accepted a synthetic transcript email and deduplicated the next check. Local browser fixture verified keyboard submission and generated title; 390px viewport had no horizontal overflow and a usable input. Full backend record and IaC live in the sibling chat repository at `docs/aws-launch-2026-09-28.md` and `infra/lambda`.

Rollback: empty `chatEndpoint` in `config.js` and publish. Prepared answers and direct free-call booking remain available. No DNS change is needed.
