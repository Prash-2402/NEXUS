# NEXUS — AN AI UTSAV
### Flagship Festival of CAADS | CHRIST (Deemed to be University), Bangalore

An immersive, cinematic, galaxy-inspired digital experience designed for **NEXUS (23 November 2026 – 5 December 2026)**.

---

## Creative Concept: "Different Worlds Converging Into One Universe"

The frontend is architected around a 5-layer moving cosmic space environment:
1. **Deep-Space Void:** Midnight-indigo (#030308, #090817, #17102E).
2. **Distant & Mid Stars:** Procedural 3D perspective stars with multi-frequency twinkling and cosmic palette.
3. **Cosmic Nebulae:** Breathing blue-violet procedural clouds with subtle drift.
4. **Stardust Particles:** Near-field floating particles with mouse parallax and scroll momentum.
5. **Hero Focal Point:** Luminous NEXUS typography, atmospheric glow, and live countdown capsule.

---

## The Three Event Worlds & Complete Roster

### 1. World of Synthesis (Technical)
- **Hackathon:** AI-driven innovation sprint.
- **Cryptic Hunt:** Multi-layered cyber enigma and cipher decrypts.
- **Reverse Engineering:** Systems deconstruction and binary analysis.
- **Workshops:** Hands-on masterclasses in neural networks & computational intelligence.

### 2. World of Kinetic Strategy (Non-Technical)
- **Sports:** Athletic arena tournaments.
- **Murder Mystery:** Forensic simulation and deductive investigation.
- **NEXUS Olympics (6-in-1 Decathlon):**
  1. *Word Auction*
  2. *Song Tuning*
  3. *Family Feud*
  4. *Spelling Bee*
  5. *Go With the Flow*
  6. *Dialogue-related Game* (Provisional title, easily editable)

### 3. World of Resonance (Cultural)
- **Dance:** Choreographies merging rhythm and synchrony.
- **Song:** Vocal power and melodic composition across genres.
- **Talent Show:** Grand finale open arena for extraordinary arts.

---

## How To Maintain & Update (No Code Changes Needed)

### 1. Update Global Metadata, Tagline & Event Google Forms
Edit **`src/config/site.ts`**:
- `tagline`: Update the official event tagline globally.
- `registration.eventForms`: Paste the official Google Form URLs for each event:
  - `hackathon`
  - `cryptic-hunt`
  - `reverse-engineering`
  - `workshops`
  - `sports`
  - `murder-mystery`
  - `nexus-olympics`
  - `dance`
  - `song`
  - `talent-show`
  Each event's "Register" button automatically opens its corresponding Google Form.
- `media.promoVideoUrl`: Paste your official YouTube embed URL (e.g. `https://www.youtube.com/embed/VIDEO_ID`).
- `socials.instagramUrl`: Update the official Instagram handle.
- `socials.contactEmail`: Update official committee inbox.

### 2. Update Event Details, Rules & Timings
Edit **`src/data/events.ts`**:
- When rules, venues, or timings are confirmed, replace the `"Details coming soon"` placeholders for any event.
- If the provisional title for the Olympics dialogue game changes, edit `name` under `subActivities` of `nexus-olympics`.

### 3. Update Official Logos & Assets
Place image/SVG assets into `public/assets/`:
- `public/assets/logos/nexus-icon.svg` — Event logo
- `public/assets/logos/caads-logo.svg` — CAADS club logo
- `public/assets/logos/christ-logo.svg` — CHRIST University logo

---

## Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (outputs to /dist)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Deployment Ready
The `/dist` directory contains a static, production-grade bundle compatible with:
- **Vercel** (`vercel deploy`)
- **Netlify** (drag and drop `/dist`)
- **GitHub Pages**
- **Cloudflare Pages**
