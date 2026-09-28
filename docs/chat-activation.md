# Chat activation — 28 September 2026

The founder authorized an AWS backend managed with IaC, a $50 AWS monthly budget, a $100 Experiential AI budget, 30-day AWS transcript retention, and emailed transcript copies. The founder confirmed the AI budget was configured and the owner inbox was verified.

`config.js` points to the qualified Sanifu HTTP API. It contains only a public endpoint and the existing template video URL. Credentials remain server-side in Secrets Manager. `docs/design/v1` is unchanged. The existing AI phone link from site main `42991e2` is preserved.

Public privacy copy and the visible chat status disclose emailed transcripts. The 30-day expiry applies to AWS transcripts from their last update; it does not erase email copies or Experiential captures, which currently have no fixed expiry. The delete confirmation describes these limits. Gateway throttling and AWS budget alerts are not hard monetary ceilings.

Before activation: 20 buyer-question replies and eight multi-turn scenarios reviewed with no critical failures; live saved conversations, titles, briefs, exact-version approval, rejected stale approval, owner access, deletion, CORS and actual TTL checked. SES accepted a synthetic transcript email and deduplicated the next check. Local browser fixture verified keyboard submission and generated title; 390px viewport had no horizontal overflow and a usable input. Full backend record and IaC live in the sibling chat repository at `docs/aws-launch-2026-09-28.md` and `infra/lambda`.

Rollback: empty `chatEndpoint` in `config.js` and publish. Prepared answers and direct free-call booking remain available. No DNS change is needed.
