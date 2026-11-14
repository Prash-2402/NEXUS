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

## Stage launch (`/launch`)

A hidden page for the launch event: a 95-second "NEXUS is back" film with a beat and voiceover,
ending in the live site. It opens on a locked screen; pressing **Launch** (or Space / Enter) starts it.

| Time | Chapter |
| --- | --- |
| 0:00 | Ten-second countdown |
| 0:10 | Memory: last year's photos drift past. "Last year, we built something." |
| 0:22 | Montage: photos cut on the beat. "The nights. The noise. The wins." |
| 0:32 | Blackout: "It never really ended." |
| 0:38 | The drop: **NEXUS IS BACK**, warp, full beat |
| 0:42 | CHRIST, Department, CAADS: four seconds each, every logo lands on a beat drop |
| 0:54 | Fly past Earth, Jupiter and Saturn; each world's events land one per beat |
| 1:12 | The planets pull into orbit: "Different worlds. One universe." |
| 1:18 | Save the dates, with day / event / world counters |
| 1:26 | The logo assembles from particles and locks in on the final drop |
| 1:34 | Handoff into the live homepage |

- **Photos:** 25 photos from last year's NEXUS (CAADS 25-26 Drive: FIFA, Murder Mystery, Tech Olympics,
  Interactive event) in `public/launch/photos/01-25.webp`. Group and action shots only, each checked for
  sharpness. The first 14 drift past in the memory chapter, the rest are cut on the beat.
  To swap one, replace the file and keep the name.
- **Beat:** synthesised in the browser at 120 BPM (`src/launch/beat.ts`), no audio files or licences.
  Every logo lands on a drop: a build, half a beat of silence, then a distorted 808 boom with a mid
  "thud" so it is heard on laptop and projector speakers. A limiter on the output prevents clipping.
- **Voiceover:** pre-generated clips in `public/launch/vo/` (Microsoft neural voice, made with
  `scripts/generate-voiceover.py`). If you change a line in `VOICE_LINES` (`src/launch/timeline.ts`),
  change it in the script too and re-run it. A missing clip falls back to the browser's speech voice.
- **F** fullscreen. **→** jumps to the next chapter (for rehearsals). **Esc** skips straight to the site.
- Works at `/launch` on Vercel (`vercel.json`) and Netlify (`public/_redirects`), and at `/#launch` anywhere.
- Open it a minute early so the planet textures load, then leave it on the locked screen.
- Timings live in `src/launch/timeline.ts`; the camera path per chapter in `launchFrame()` in
  `src/scene/SpaceEngine.ts`; the picture layer in `src/launch/Cinematic.tsx`.

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
