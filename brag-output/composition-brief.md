# Hyperframes Composition Brief: Ayodhya Agarbatti

## Objective
Create a short launch-style brag video for Ayodhya Agarbatti — a premium sacred-incense e-commerce brand that also sells arc-second-precision Vedic horoscope readings under a feature branded "AI," where AI actually stands for "Almighty Īśvara," not artificial intelligence.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds (15-25s range)

## Source Material
- Project root: `C:\Users\Lohith-IA\Desktop\Ayodhya Agarbatti`
- Primary files read: `index.html`, `src/index.css`, `src/components/Hero.jsx`, `src/components/ProductSection.jsx`, `src/components/TrustBar.jsx`, `src/i18n.js`, `src/data/products.js`, `src/pages/horoscope/HoroscopeLanding.jsx`, `horoscope-engine/README.md`
- Product name: Ayodhya Agarbatti
- Tagline / strongest claim: "Handcrafted in the Holy City" / "AI here means Almighty Īśvara — the supreme being of the Vedic tradition — not artificial intelligence." (verbatim from `horoscope-engine/README.md`)
- Key UI or visual moment to recreate: the hero's gold gradient wordmark over the ritual-smoke background, and the white product-card grid style used for both the four incense fragrances and the horoscope offering
- Copy that must appear verbatim:
  - "Sacred Aroma" (hero title, `heroTitle1`/`heroTitle2`)
  - "Handcrafted in the Holy City" (`heroTagline`)
  - "Espresso Ground Incense", "Madagascan Calm Incense", "Citrus Clarity Incense", "Creative Spark Incense" (four product names)
  - "33 Hand-Rolled Sticks" / "45-50 Minutes per Stick" (product facts)
  - "Janma Kundali · ₹99" (horoscope product)
  - "AI here means Almighty Īśvara. Not artificial intelligence." (paraphrase of the README's own clarifying line — keep it this close to verbatim)
  - "Ayodhya Agarbatti" / "Where prayer meets purity." (outro wordmark + tagline, from `heroSubtitleItalic`)

## Creative Direction
- Tone preset: polished
- Creative direction: a quiet, premium incense-brand product film that holds its composure straight through one perfectly deadpan clarification about its "AI" feature
- Interpretation: slow, confident reveals (0.6-0.8s crossfades), generous letter-spacing, no bullet-point energy, no comedic emphasis anywhere — including on the joke line itself
- Angle: Play it as a quiet, premium incense-brand film — gold on deep maroon, temple smoke, the four fragrances — right up until the horoscope feature. The reveal that "AI" doesn't mean artificial intelligence, delivered with the exact same deadpan confidence as the rest of the copy, is the whole joke. No one winks. The brand doesn't know it's funny.
- Hook: gold gradient wordmark "Sacred Aroma" burns in over a warm ritual-smoke background, tagline "Handcrafted in the Holy City" tracks in above it — immediate luxury-fragrance-ad register.
- Outro / punchline: "AI here means Almighty Īśvara. Not artificial intelligence." holds on screen, then the film returns to the wordmark "Ayodhya Agarbatti — Where prayer meets purity."
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Any joke framing, stinger, or comedic sound on the AI clarification line — it must be scored and paced exactly like the rest of the film

## Visual Identity
- Background: `#1A0505` body, radial gradient to `#3E1414` / `#0F0202` (deep sacred maroon) for dark scenes; `#FDFBF7` (ivory) / white product cards for the fragrance and horoscope scenes
- Text: `#FDFBF7` (ivory) on dark scenes; `#1A1A1A` (charcoal) on white card scenes
- Accent: `#D4AF37` (gold)
- Display font: Cinzel (headings) with Playfair Display serif italic accents; fall back to a similar serif/display Google Font pairing if unavailable
- Body font: Outfit; fall back to a similar geometric sans if unavailable
- Visual references from the project: the hero's gold gradient text treatment over `ritual_bg.png`; the white product cards with gold category pill, star rating, and dark "burn time" badge bar from `ProductSection.jsx`; the gold/charcoal button styling

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 5s — gold wordmark "Sacred Aroma" + "Handcrafted in the Holy City" over ritual-smoke maroon background
2. The four fragrances — 6s — four white product cards stagger in (Espresso Ground, Madagascan Calm, Citrus Clarity, Creative Spark), each with gold category pill and burn-time/stick-count badge, then hold as a full set
3. The horoscope card — 6s — one white card settles in ("Janma Kundali · ₹99", arc-second-precision line), beat, then the clarifying line types/fades in beneath it in the same typographic voice: "AI here means Almighty Īśvara. Not artificial intelligence."
4. Outro — 4s — return to maroon ritual background, wordmark "Ayodhya Agarbatti" + tagline "Where prayer meets purity." settles center frame, music fades under the hold

## Audio
- Audio role: warm bed with cinematic restraint
- Audio arc: one continuous, unhurried bed under the whole film, flat through the product beats, a slight lift and fade-out under the final wordmark; no percussion-driven energy, no swell on the joke line
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` ("steady and clean" — best fit for `polished`/`cinematic`), volume 0.3-0.35, never above 0.4
- Music treatment: fade in under Scene 1, hold flat and low through Scenes 2-3, slight lift then fade to silence under Scene 4's wordmark hold
- Music cue guidance: bundled preset at `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (tempo ≈ 109.96 BPM). Candidate strong cues in this video's window: ~8.74s and ~10.93s (near the Scene 2→3 boundary — good for the horoscope card's arrival) and ~17.47s (near the Scene 3→4 boundary — good for the outro wordmark). Treat as optional ±0.15s hints only; do not force scene length to match them at the cost of the reading-time floor.
- Audio-reactive treatment: subtle; music RMS may let the hero glow / card drop-shadow presence breathe very slightly. No waveform, no equalizer, no strobing — restraint is the point of this film.
- Audio-coupled moments:
  - Scene 2 card stagger — light card-settle texture on each of the four cards, quiet enough not to read as playful
  - Scene 3 horoscope card arrival — one quiet card-settle sound only; the clarifying line beneath it gets no SFX at all
  - Scene 4 outro — no SFX beyond the music's own fade
- SFX selection guidance: minimal but present, per the `polished` tone table in `audio.md` — 2-3 very subtle cues total across the whole video (e.g. a soft `interface/drop_001`-family sound for card settles). Nothing from the glitch/error/comedic families. Absolutely no SFX accent on the AI clarification line itself.
- SFX analysis guidance: consult `<brag-skill-dir>/assets/sfx/sfx-analysis.md`; prefer low/medium high-frequency-risk files since every moment here is polished and some repeat across the 4-card stagger.
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.
- Audio files: music already copied to `brag-output/composition/assets/music/` (and its cue preset to `brag-output/composition/assets/music/cues/`); Hyperframes should copy any SFX it selects into `brag-output/composition/assets/sfx/...` (empty family folders already created under that path).

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). `/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (the product cards and the horoscope card copy satisfy this).
- Keep all text readable in the final render — hold the AI clarification line and the four fragrance names to at least the reading-time floor from `step-2-plan.md`.
- Keep the video within 15-25 seconds (target 21s).
- Include the planned music/SFX layer — it was not disabled and is not intentionally silent.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Hyperframes decides exact animation timing and should ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks in this 21s video.
- Use SFX to support motion and interaction: card sounds for the card-like reveals, restraint everywhere else — this is a `polished`-tone film, not a `default` or `chaotic` one.
- Honor the planned music treatment: flat low bed through the middle, slight lift and fade-out under the final wordmark.
- Consider the Hyperframes audio-reactive workflow for one subtle element (hero glow or card presence breathing with RMS) — skip and document if extraction is unavailable.
- Use local assets for audio and any required runtime/media dependencies when possible.
- Run `hyperframes check` before render — it is brag's single gate.
