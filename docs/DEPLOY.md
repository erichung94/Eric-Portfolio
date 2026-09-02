# Deploy — erichung.dev

Host: **Netlify**. DNS: **stays at GoDaddy** (A record for apex + CNAME for www).
The site is a static Astro build: `npm run build` → publish `dist/`.

## One-time setup

### 0. Push the repo to GitHub

Done. Public at https://github.com/erichung94/Eric-Portfolio, `main` tracked.
Netlify builds whatever is on `main`, so push before expecting a deploy.

### 1. Connect to Netlify

1. Netlify → **Add new site** → **Import an existing project** → **GitHub** → pick `erichung94/Eric-Portfolio`.
2. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`, Node `22.19.0`). Accept and deploy.
3. When the first deploy finishes, open the `https://<site-name>.netlify.app` URL and check:
   - `/` loads in light mode, `/dancer` loads in dark mode
   - the Developer / Dancer switch flips the whole site with no reload
   - `/anything-else` shows the styled 404 page
   - the "Résumé" button downloads the PDF

> The content hold that used to sit here is lifted. See "Content status" below.

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

## Content status

The dev side is finished and is what the launch is for. The dance side is
deliberately a holding page: a hero, a "Coming soon" panel, and contact. It
carries `noindex` so it does not rank for Eric's name while it is a stub.

Ready:

- `AboutDev.astro` - real copy, written by Eric
- `og-dev.png` / `og-dance.png` - real 1200x630 cards, day and night
- `profile.ts` - `links.instagram` set, `links.repo` resolves
- `photos.dance` - empty, so no stand-in is presented as a dance photo

Not blocking launch, wanted before the dance side is promoted:

- a real dance photo, plus a decision on the `scaleX(-1)` mirror in
  `global.css`, which will reverse a recognisable lead/follow position
- `lessons.ts` blurb and rates, `videos.ts` embeds and gallery
- restoring `Lessons`, `Watch` and `AboutDance` in `DanceSections.astro`;
  they are still in the tree, unused
- dropping the `noindex` in `SiteShell.astro` once there is something there

## Notes specific to this domain

- **`.dev` is on the HSTS preload list.** Browsers refuse plain HTTP for it, with
  no click-through. The site is unreachable until Netlify's certificate is
  issued, which is normal and not a misconfiguration. Do not judge the cutover
  until HTTPS is live.
- **GoDaddy domain forwarding overrides DNS records.** If forwarding or parking
  is on, the A and CNAME records are ignored and the domain keeps showing the
  parked page. Turn that off before debugging anything else.

## Record of the actual deploy

Live at **https://erichung.dev** since 2026-09-02.

- Netlify site: `stellar-daffodil-5aa950` (`stellar-daffodil-5aa950.netlify.app`)
- Primary domain: `erichung.dev`; `www` added as an alias and auto-redirects
- GoDaddy A record: `@` -> `75.2.60.5`, replacing the Website Builder record
- GoDaddy CNAME: `www` -> `stellar-daffodil-5aa950.netlify.app`, replacing `erichung.dev.`
- Nameservers unchanged: `ns43` / `ns44.domaincontrol.com`
- Certificate: Let's Encrypt, issued 2026-09-02, SANs `erichung.dev` and
  `www.erichung.dev`, renews automatically

Verified on the live domain:

- `/`, `/dancer`, `/robots.txt`, `/sitemap-index.xml`, the resume PDF and both OG
  images all 200; an unknown path 404s to the styled page
- `https://www.erichung.dev/` 301s to `https://erichung.dev/`
- All three `netlify.toml` headers present, plus Netlify's HSTS
- axe: 0 violations on both routes
- 366ms load and 191KB transferred on `/`; 165ms and 24KB on `/dancer`

### Gotchas hit on the way

- **Netlify site protection was on by default.** Every route returned 401 and
  redirected to `app.netlify.com/edge-access`. Set visitor access to public
  under Access & security. Worth checking first if a fresh site looks broken.
- **The apex A record was owned by a GoDaddy Website Builder site**, not a plain
  parked IP, so it had to be replaced rather than just edited around.
- **`/dancer` used to 301 to `/dancer/`** while the canonical and sitemap both
  declared `/dancer`. Fixed with `build: { format: 'file' }` in `astro.config.mjs`
  before the cutover.
