# jr-jingle-journey — Interactive Tokyo JR station departure melodies

> Parent context: `../CLAUDE.md` has universal preferences and conventions. Keep it updated with anything universal you learn here.

## What this is
An interactive subway map of Tokyo's JR lines. Click a station to see its official-style station sign and hear a chiptune arrangement of its departure melody (発車メロディ). MVP is Yamanote Line only.

## Stack
- Vite 8 + React 19 + TypeScript 6 + Tailwind v4 (via `@tailwindcss/vite` plugin, NOT PostCSS)
- React Router (HashRouter) for future multi-line routes
- Tone.js for chiptune jingle synthesis
- `base: '/jr-jingle-journey/'` in vite.config.ts
- Deployed to sakhalteam.github.io/jr-jingle-journey/

## Notable patterns
- Station data in `src/data/stations.ts` — all 30 Yamanote stations with kanji, furigana, romaji
- SVG schematic ellipse map (not geographic)
- `<StationSign />` component mimics real JR East sign style
- Jingles are chiptune covers via Tone.js (Option C — legally safe, no copyrighted audio hosted)
- 3 jingles implemented: Shinjuku, Ebisu, Takadanobaba. Rest get placeholder beep.
- `playJingle(stationId)` in `src/audio/jingles/index.ts` dispatches to station-specific module

## Island zone
`zone_the_tunnels` → subway scene → `portal_jr_jingle_journey` (train mesh) → `/jr-jingle-journey/`

## Audio copyright
Station jingles are copyrighted (JR East / Minoru Mukaiya / Switch Inc.). We use transformative chiptune covers, not reproductions. Ebisu source melody is "The Third Man Theme" (Anton Karas). Takadanobaba is "Astro Boy" theme. Both noted in jingle file comments.
