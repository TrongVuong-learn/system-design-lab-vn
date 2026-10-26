# GAME12 verification

Parent technical/UI review, browser emulation rather than physical phones or a student pilot.

- Dedicated balance/cache/queue scenes, read-only replay, text equivalents and finite GSAP timelines. Rules/persistence/core unchanged. Source/cache branches preserve actual returned version; queue accepts before servicing and represents lost jobs separately.
- Verified bug: rapid input followed by reduced-motion could retain a previous stage label when the next media context never entered normal mode. Fixed explicit reduced branch and reset presentation; regression included.
- 110 unit tests pass; lint, formatting and production build pass. 28 game/motion tests across mobile/desktop Chromium, Firefox and WebKit: actual transform changes and final positions, replay leaves storage untouched, stale cache, overflow, rapid input/reset/reduced-motion changes, reload without autoplay, corrupted/blocked storage, offline dynamic runtime.
- Reviewed 320/390/1280 screenshots. Increased diagram type for narrow widths; real labels and text explain symbols independently of color. Motion lasts approximately 2–2.3 seconds; no loops and no required waiting. Scene details are illustrative and labelled as such; every result comes from core replay.
- Evidence images in evidence/. Local diagnostic logs and captures in .cache/game12. Release CI and Vercel outcome recorded in the PR after verification.
