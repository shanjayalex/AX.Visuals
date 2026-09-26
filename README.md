# AX.Visuals website

This is the cinematic portfolio and booking site for AX.Visuals, built with Next.js 16 (App Router), TypeScript, Tailwind v4, GSAP (ScrollTrigger, SplitText, Flip), Lenis and Framer Motion.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

The site runs with **no environment variables**. Each integration switches on when you add its keys (see `.env.example`):

| Integration | Without keys | With keys |
|---|---|---|
| Resend | Bookings are printed to the server log | Call-sheet emails go to the client and the studio, with slip/moodboard attachments |
| PayHere | "Pay with PayHere" is saved as a request, and the client is told a payment link will follow | Redirects to PayHere checkout for the 50% advance. `/api/payhere/notify` verifies the signature and emails the studio |
| Google Calendar | Every future date is selectable, with the note "confirmed by the studio" | Busy days are blocked, and a tentative hold is created on submit |

For PayHere, set the notify URL to `https://YOUR-DOMAIN/api/payhere/notify` and whitelist your domain in the merchant portal.

## Where to edit things

| What | File |
|---|---|
| **Every price, package, add-on, travel zone, policy** | `content/pricing.ts` (the single source of truth; pages and the booking estimator both read it) |
| Contact details, WhatsApp number, bank details, socials, stats, FAQ, testimonials | `content/site.ts` |
| Portfolio projects, photos, YouTube reels | `content/work.ts` |
| Industries on the Services page | `content/industries.ts` |
| Crew, gear, studio story | `components/about/About.tsx` |

Search for `[EDIT]` to find everything that still needs real information.

Adding photos: put the originals in the folder above `site/`, map them in `scripts/optimize-media.mjs`, then run `node scripts/optimize-media.mjs`. It writes web-sized copies to `public/media`.

Claymation: until the Part B clips exist, Axel is drawn in SVG at 12fps (`components/clay/Axel.tsx`). To use the real clips, drop an MP4 or WebM into `public/clay/` and pass `src="/clay/bts.mp4"` to `<AxelClay>`.

## Routes

`/` · `/work` · `/work/[slug]` · `/services` · `/pricing` (+ `/pricing/monthly`, `/restaurants`, `/products`, `/services`) · `/pricing?print=1` (light brochure, print or save as PDF) · `/booking` · `/about` · `/contact` · `/terms` · `/styleguide` · 404.

## Deploy (Vercel)

1. Push the `site/` folder to GitHub and import it in Vercel (framework: Next.js).
2. Add the environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Notes

- Video is embedded from YouTube (youtube-nocookie). To switch to Mux or Cloudinary HLS later, change `components/media/YouTube.tsx`.
- `prefers-reduced-motion` turns off smooth scroll, pinning, the preloader counter and the heavy effects. Prices render instantly.
- Sound (shutter, slate clap) is synthesised with WebAudio, so there are no audio files. It is off by default, and the toggle is in the nav.
