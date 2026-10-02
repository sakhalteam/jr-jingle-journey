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


## How to end your messages — the "For Nic" block (org-wide rule)

Nic has severe ADHD and loses mid-run asides ("by the way...", "one thing to check
before you...") and anything buried in closing prose. **This is not a request to be
less detailed** — keep the full explanation, reasoning and tradeoffs. Just always end
the turn with a landing pad, as the LAST thing in the message:

```
---
**For Nic:**
1. <verb-first action> — <why, one short clause>
2. ❓ <decision only Nic can make> — <option A vs option B>
3. ⏸️ <parked / needs its own session>
```

- Every "by the way" you had this turn lands here, or assume he never read it.
- Numbered not bulleted; verb first; max 5, most important first.
- No recap of what you already did — that's the body's job. This is Nic's list.
- **Don't force it.** Only what Nic actually needs to notice or act on. It's a TL;DR + call to action, not a test of how many todos you can come up with — one real item (or "Nothing — all clear") beats five padded ones.
- Nothing for him? Still write it: `**For Nic:** Nothing — all clear.`

Full spec lives in the universal `~/.claude/CLAUDE.md` (and `Code/CLAUDE.md`).
