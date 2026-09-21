# Bavaan AI

PAYG multi-model AI platform for `ai.bavaan.ir`.

## Included
- Persian RTL multi-page landing, model catalog, pricing and docs
- Email/password auth + optional Google OAuth
- Free starter credit
- Intent-based onboarding (in the user's own language) + switchable workspaces
- OpenAI-style `/api/v1/chat/completions` and `/api/v1/models`
- API keys, request-level usage/cost ledger and wallet
- Admin analytics, wallet control, provider expenses, model costs/markup and activation
- Docker + PostgreSQL deployment through GitHub Actions using `HOST` and `PASS`

## Secrets
Already expected: `HOST`, `PASS`.
Add: `ADMIN_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_GATEWAY_ID`.

Google callback URL: `https://ai.bavaan.ir/auth/google/callback`

Provider models seed as inactive and with zero cost on purpose. Set current upstream prices + markup in Admin before activation. This prevents accidental underbilling.

Before commercial raw-API resale, confirm reseller/OEM permission with each upstream. The provider layer is intentionally replaceable.
