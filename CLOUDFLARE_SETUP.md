# Cloudflare and Google Sheets setup

## Google Sheets

1. In Google Cloud Console, create a project, enable the Google Sheets API, and create a service account.
2. Create a Google Sheet and share it with the service account's `client_email`, giving it Editor access. The app creates a tab named `Records` on first use; do not rename that tab.
3. Copy the spreadsheet ID from its URL. It is the value between `/d/` and `/edit`.
4. For local Next.js development, set `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON` in `.env.local`. For the Cloudflare Vite development server, use `.dev.vars` instead. The service-account JSON must be a JSON-encoded string. Do not commit either file or the downloaded service-account key.

For deployment, add both values as Worker secrets named `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON`. In the Cloudflare dashboard, open the deployed Worker, go to **Settings > Variables and Secrets**, add each as a **Secret**, then deploy the change. The service-account JSON remains server-side and is never sent to the browser.

The sheet stores one record per row with `kind`, `id`, and `payload` columns. The API reads and updates records there; it does not commit changes to Git.

## Dashboard login

The app has a single-user login page. Authentication is checked server-side, uses a signed, HttpOnly, SameSite=Strict cookie, and protects both dashboard pages and `/api/*` routes. The session expires after seven days.

Configure these values for local development in `.env.local` (Next.js) or `.dev.vars` (Cloudflare Vite development):

```dotenv
DASHBOARD_USERNAME=your-login-name
DASHBOARD_PASSWORD=use-a-long-unique-password
DASHBOARD_SESSION_SECRET=use-a-random-secret-at-least-32-characters-long
```

For deployment, add all three values as **Worker Secrets**, not plaintext `vars`, under **Workers & Pages > your Worker > Settings > Variables and Secrets**. Generate a unique session secret, for example with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Do not commit credentials or put them in `NEXT_PUBLIC_*` variables. Restart local development after changing `.env.local`.

Use a unique password and configure a Cloudflare rate-limit rule for `/api/auth/login`. Cloudflare Access can also be enabled as an additional protection layer.

## Build and deploy

The Cloudflare adapter uses vinext. Check the compatibility report, then run:

```powershell
npm run build:vinext
npm run deploy:vinext
```

The Cloudflare build requires the Workers runtime tooling. If local preview fails on Windows ARM64, deploy from Cloudflare's Git integration or an x64 CI runner instead.