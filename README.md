# Onwards public website

Static public website for `https://www.onwards-together.com`.

## Structure

- `/` — product landing page
- `/privacy/` — privacy policy
- `/terms/` — terms of service
- `/support/` — support and account-deletion contact

The site has no build step, analytics, cookies, forms, or third-party runtime
dependencies. Fonts and brand assets are self-hosted.

## Local preview

Run a static server from this directory, for example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Vercel deployment

Import this repository into Vercel as an unmodified static site. It has no build
command or output directory. `vercel.json` defines the trailing-slash behavior,
security headers, and static-asset caching.

Add both `onwards-together.com` and `www.onwards-together.com` to the Vercel
project, keep `www` as the canonical production domain, and redirect the apex
domain to `www` in Vercel's domain settings. Keep DNS hosted at the registrar
and change only the web-hosting records to the exact values Vercel provides.
Preserve all Google Search Console and Resend email-verification records.

After trusted HTTPS works for both hostnames, add the production HSTS header to
`vercel.json`. The canonical production origin is
`https://www.onwards-together.com`.
