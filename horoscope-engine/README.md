# Jāthaka · All Mighty Īśvara - Vedic Horoscope Calculator 🕉

A single-page, **fully offline** Vedic (Jyotiṣa) calculator with **no server, no artificial
intelligence, and no network calls at runtime**. It has two modes:

- **Horoscope** - one birth chart in, a complete **30-section Janma Kundali** out.
- **Marriage compatibility** - the groom's and bride's birth details in, an **8-section Ashtakoota
  (36-point) Guṇa Milan** match out.

### The AI in "Jāthaka AI" is Almighty Īśvara

The product name is **All Mighty Īśvara (Jāthaka AI)**, and the expansion is stated on the page
itself wherever the initials appear. **AI here means Almighty Īśvara** - the supreme being of the
Vedic tradition - **not artificial intelligence**. The site says so in plain words rather than
leaving the reader to assume a language model is involved, because none is.

What that framing sits on is a real calculation: grahas placed from a Swiss-Ephemeris-grade
ephemeris to arc-second precision, a Lagna computed from true sidereal time at the birth
coordinates, and Vimśottari daśā dates taken from the Moon's exact nakṣatra position. The reading
is then drawn from those positions by the rules of the śāstra. See *Nothing is generated* below.

**Live site:** <https://rdlohith.github.io/jathaka-horoscope/> (GitHub Pages, `main` branch, root)

## Horoscope mode - what it computes

- Sidereal (Nirayaṇa) positions with the **Lahiri (Chitrapakṣa) ayanāṁśa**, whole-sign houses, mean-node Rāhu/Ketu
- Pañcāṅga (tithi, vāra, nakṣatra, yoga, karaṇa), sunrise/sunset, moonrise/moonset, and Avakhaḍa Chakra
- North & South Indian Rāśi charts, plus 15 divisional (varga) charts
- Ashtakavarga (BAV/SAV), Shadbala, Bhavabala, Chara Kārakas, Jaimini points, Upagrahas, Gulika
- Yogas (Gajakesari, Pañca Mahāpuruṣa, Kendra-Trikoṇa Rāja, Dhana, Vipareeta Rāja, Nīcha-bhaṅga Rāja…),
  doshas (Manglik, Kāla-Sarpa, Pitru, Guru Chāṇḍāla, Kemadruma, Graha Yuddha), house-lord analysis, aspects
- Career & finance in depth (business vs service, sector, leadership, income, savings, property,
  inheritance, risk temperament) and education, foreign study, travel & lifestyle
- Vimśottari daśā to three levels (mahā → antar → **pratyantar**) and Yoginī daśā, Sade-Sati,
  year-by-year Gochara to 2100, near-term forecast
- Rule-based life readings, remedies, and a branded **PDF export** (print to PDF)
- Marriage in depth: spouse profile, timing windows, **love vs arranged inclination** (5th/7th tie,
  Venus-Mars contact and Rāhu on the 7th against a 9th-7th tie and Jupiter/Saturn on the 7th), and
  **foreign or distant match** indications (7th lord in a chara/dvisvabhāva sign, 7th-12th
  connection, Rāhu on the 7th or with its lord)
- **The five-part contract** - see below
- **Birth time unknown?** Tick the box and the chart is cast for noon with the limitation stated in
  full at the top of the report. No reading is graded *strong* while the time is unknown, and every
  daśā date carries the caveat that the Moon's position is uncertain by up to half a nakṣatra
- Optional **device-local login** (accounts stored only in your browser; nothing is sent anywhere)

## The five-part contract

Every reading that fires a classical test carries the same five things, so a reader can weigh it
rather than take it on trust:

| # | Part | Where it appears |
|---|---|---|
| 1 | **Classical rule used**, and the text it comes from | `Rule` + `Tradition` in the disclosure |
| 2 | **Planets & houses involved** - the values from *this* chart | `This chart` in the disclosure |
| 3 | **Strength/confidence** - strong / moderate / weak | `Strength` pill in the disclosure |
| 4 | **Applicable daśā or transit window** | `Activates` in the disclosure |
| 5 | **Plain-language explanation** | the reading prose the disclosure hangs beneath |

Parts 3 and 4 are *computed*, never asserted by hand. Strength comes from planetary dignity,
combustion, and kendra/trikoṇa/dusthāna placement of the grahas that actually formed the yoga
(`gradeIndication` in `src/engine.js`); the window comes from the Vimśottari periods of those same
grahas (`activationWindow`). Doshas and cautions are graded in the opposite direction - a
well-placed graha afflicts *less* - and where a rule carries no timing at all, such as the kootas of
a marriage match, the report says so instead of inventing a period.

## Marriage compatibility mode - what it computes

Enter both nativities and each is cast in full - Rāśi (D-1) and Navāṁśa (D-9) - before any matching
begins. The report runs to eight sections:

1. **At a glance** - the score out of 36, a plain verdict, and the specific strengths and friction points
2. **Ashtakoota** - all eight kootas (Varṇa, Vaśya, Tārā, Yoni, Graha Maitrī, Gaṇa, Bhakūṭa, Nāḍī), each
   drawn to its own weight, using the classical tables - including the full 14×14 yoni matrix
3. **The dosha gates** - Nāḍī and Bhakūṭa **with their classical cancellation rules applied**, shown
   either way, because a total that has not been through these means little
4. **Beyond the kootas** - what a Moon-to-Moon comparison misses: cross-chart 7th-lord overlay,
   Venus/Jupiter kārakas, Manglik matching with Bhaṅga conditions, daśā overlap, and a **Navāṁśa (D-9)
   cross-read**, which the tradition ranks above the koota total on any marital question
5. **Area by area** - separate scores for emotional, mental, communication, family, financial,
   long-term-stability and physical compatibility
6. **Both charts** - D-1 and D-9 for each person, with full graha tables
7. **Daśā & timing** - the running mahā, antar and pratyantar periods of both charts, plus what is
   coming, separating *when* from *whether*
8. **Remedies & next steps** - traditional observances where a dosha stands, plus a ranked list of what
   to take to a human astrologer

A match can be shared as a link too - it carries both sets of birth details, so treat it accordingly.

## Accuracy

The astronomy comes from **[astronomy-engine](https://github.com/cosinekitty/astronomy)** (Don Cross,
MIT) - Swiss-Ephemeris-grade positions. The Lahiri ayanāṁśa model reproduces the Swiss Ephemeris to
under 0.001 arc-second across 1900-2100, and the engine was validated arc-minute against `pyswisseph`.

## Nothing is generated

No language model is involved at any point - see *The AI in "Jāthaka AI" is Almighty Īśvara* above.
Every line of every reading is the output of a fixed classical test applied to the computed chart, so
the same birth details always produce byte-identical text. Each verdict carries a **"why this
reading?"** disclosure showing the rule, the chart values that satisfied it, how strongly it reads,
when it activates, and its tradition - and where a rule is popular in modern practice but absent from
the classical corpus (Kāla-Sarpa, for instance) it says so.

## Build

`index.html` is generated by concatenating the sources in `src/`:

```bash
python3 build.py   # -> index.html
```

Sources: `src/page.html` (markup + CSS), `src/engine.js` (core), `src/engine2.js` (extended
sections), `src/engine3.js` (marriage compatibility), `src/ui.js` (rendering + UI),
`src/astronomy.browser.min.js` (astronomy-engine, MIT).

## Credits & licence

Astronomy by **astronomy-engine** © Don Cross, MIT. This project is provided for education and cultural
interest. Vedic astrology is a traditional interpretive system - the astronomy is exact, but the
readings are offered for reflection, not as prediction or professional advice.
