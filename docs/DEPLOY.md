# Deploy — erichung.dev

Host: **Netlify**. DNS: **stays at GoDaddy** (A record for apex + CNAME for www).
The site is a static Astro build: `npm run build` → publish `dist/`.

## One-time setup

### 0. Push the repo to GitHub (if not already)

```bash
cd "C:\Users\Nobody\Desktop\Coding\Eric-Portfolio"
gh repo create Eric-Portfolio --public --source . --remote origin --push
```

### 1. Connect to Netlify

1. Netlify → **Add new site** → **Import an existing project** → **GitHub** → pick `erichung94/Eric-Portfolio`.
2. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`, Node `22.19.0`). Accept and deploy.
3. When the first deploy finishes, open the `https://<site-name>.netlify.app` URL and check:
   - `/` loads in light mode, `/dancer` loads in dark mode
   - the Developer / Dancer switch flips the whole site with no reload
   - `/anything-else` shows the styled 404 page
   - the "Résumé" button downloads the PDF

> **Do NOT connect the custom domain yet.** Hold here until the placeholder
> content is replaced (see "Before the DNS cutover" below).

### 2. Add the custom domain (only after content is real)

1. Netlify → **Site configuration → Domain management → Add a domain** → `erichung.dev`.
   Add `www.erichung.dev` too when prompted.
2. Netlify shows the DNS target values. Note them here when you do it:
   - apex `erichung.dev` → A record → `__________` (the IP Netlify shows, e.g. `75.2.60.5`)
   - `www` → CNAME → `__________.netlify.app`

### 3. Set the records at GoDaddy

GoDaddy → **My Products → erichung.dev → DNS → Manage DNS**:

1. Delete the default parked **A** record for host `@`.
2. Add **A** record: host `@`, value = the IP from Netlify, TTL 600.
3. Delete any default **CNAME** for host `www` pointing at `@`.
4. Add **CNAME** record: host `www`, value = `<site-name>.netlify.app`, TTL 600.
5. Leave the GoDaddy **nameservers unchanged**.
6. Save.

### 4. HTTPS + primary domain

1. Netlify → Domain management → **HTTPS → Verify DNS configuration**, then **Provision certificate** (Let's Encrypt). Wait for propagation (minutes to a few hours).
2. Set `https://erichung.dev` as the **primary domain**; Netlify auto-redirects `www` → apex.

### 5. Verify (after DNS propagates)

```bash
curl -sI https://erichung.dev/        | grep -i "^HTTP\|^content-type"
curl -sI https://erichung.dev/dancer  | grep -i "^HTTP\|^content-type"
curl -sI https://www.erichung.dev/    | grep -i "^HTTP\|^location"
```

Expected: `/` → 200 HTML, `/dancer` → 200 HTML, `www` → 301 to `https://erichung.dev/`.

Then run Lighthouse on the live URL (spec §14): Performance ≥ 95, Accessibility = 100.

## Ongoing

Push to `main` → Netlify rebuilds and publishes automatically. Pull requests get
their own preview URL.

## Before the DNS cutover — content that must be real first

The site is code-complete but ships with placeholders. Replace these before
pointing `erichung.dev` at it:

- `src/components/AboutDev.astro` — real bio (currently Lorem ipsum)
- `src/components/AboutDance.astro` — real dance bio (currently Lorem ipsum)
- **`src/data/profile.ts` `photos.dance`** — currently points at the DEV headshot
  as a placeholder so the mirrored dance layout can be seen. It is not a dance
  photo and the alt text says "Eric Hung dancing", so this must be swapped for a
  real one before the domain goes live. While replacing it, decide whether to
  keep the `.hero--dance .hero__shot` `scaleX(-1)` mirror in `global.css`; it
  makes the subject face into the copy, but it will reverse a recognisable
  lead/follow position.
- `public/images/og-dev.png`, `public/images/og-dance.png` — real 1200×630 social
  cards (currently solid-colour blanks; a blank card is worse than none on
  LinkedIn). If real images will take a while, temporarily remove the
  `og:image` / `twitter:card` lines in `src/layouts/SiteShell.astro`.
- `src/data/lessons.ts` — real `blurb` and `rates`
- `src/data/videos.ts` — 2–3 real embed URLs + gallery images (then also add the
  `Watch` video/gallery e2e coverage and the deferred `referrerpolicy` test)
- `src/data/profile.ts` — set `links.instagram` (Contact hides it while empty)

## Record of the actual deploy

(fill in once done)

- Netlify site name: __________
- First preview deploy: __________
- Custom domain connected: __________
- GoDaddy A record: `@` → __________
- GoDaddy CNAME: `www` → __________.netlify.app
- HTTPS provisioned: __________
- DNS cutover / go-live: __________
