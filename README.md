# NEXUS 2026 · Where Worlds Converge

Website for **NEXUS, An AI Utsav**, the flagship festival of CAADS at CHRIST (Deemed to be University), Kengeri Campus, Bangalore.
**21 November – 5 December 2026.**

## The experience

The background is a real-time 3D space journey (Three.js) driven by scroll:

| Section | What the camera does |
| --- | --- |
| Hero | Deep space; the NEXUS core glows far ahead |
| About | Flies forward through the starfield, with warp streaks when you scroll fast |
| Worlds | Passes three planets, one per world (pinned on laptops, stacked on phones) |
| Events → Schedule | Heads for the core while the planets fall into orbit around it |
| Register | The full system, slowly turning |

It weighs about 125 KB gzipped, loads after the page is visible, lowers its resolution on slow devices,
pauses in background tabs, stays still for visitors who prefer reduced motion, and falls back to a gradient without WebGL.

Scroll animations use GSAP ScrollTrigger: word-by-word headings, fade-ups, counters, the pinned Worlds section,
the reel frame and the schedule timeline.

## Editing content (no component changes needed)

| What | Where |
| --- | --- |
| Tagline, dates, logos, contact links, nav | `src/config/site.ts` |
| Google Form link for each event | `registration.eventForms` in `src/config/site.ts` |
| Events: name, description, dates, times, venue, coordinators | `src/data/events.ts` |
| Ceremonies (e.g. valedictory) | `ceremonies` in `src/data/events.ts` |
| FAQ | `src/data/faq.ts` |

The schedule is generated from each event's `sessions`, so a date only needs changing in one place.
An event with no sessions shows "Date to be announced".

The scene reads `data-stage="<n>"` attributes on sections. If you reorder sections, keep the stages in order.

## Commands

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static site in /dist
npm run preview
```

`/dist` can be deployed to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

## Media

- `public/media/og-image.jpg` is the link preview image.
- `public/assets/planets/` holds the Earth (day, night lights, clouds), Jupiter, Saturn + ring, moon, sun and Milky Way textures from
  [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0, credited in the footer).
  Laptops load the `-4k` files and phones the `-2k` ones. To swap a world's look, replace its file
  (2:1 equirectangular image) and keep the name.
- `_archive/` (git-ignored) holds the old 900-frame sequence, the original reel and the trimmed teaser (removed from the site for now).
