# SPACE STRIKE

A complete, playable browser-based 2D arcade space shooter built with React, Vite, Tailwind CSS, and the HTML5 Canvas API.

## Features
- **Main Menu** with animated starfield, glowing UI, instructions, high scores, and sound toggle
- **Gameplay**: player spaceship movement (keyboard/mouse/touch), shooting, enemy waves, enemy fire, collisions, health/lives, scoring, and increasing difficulty
- **Enemies**: normal, fast, and boss enemies (boss every 5 levels)
- **Power-ups**: rapid fire, shield, and health restoration
- **States**: Main Menu, Playing, Paused, Game Over
- **HUD**: score, high score, health bar, level, lives, pause, sound toggle
- **Effects**: Canvas-rendered ships/explosions/particles, starfield, screen shake, glowing effects
- **Persistence**: top 5 high scores and sound setting saved in LocalStorage
- **Audio**: sound effects and background music via Web Audio API
- **Responsive**: desktop, tablet, and mobile with on-screen touch controls

## Tech Stack
- React.js + Vite
- JavaScript
- Tailwind CSS
- HTML5 Canvas API
- Lucide React (icons)
- Web Audio API
- LocalStorage

## Project Structure
```text
src/
  components/
    MainMenu.jsx
    GameCanvas.jsx
    GameHUD.jsx
    PauseMenu.jsx
    GameOver.jsx
    Instructions.jsx
  game/
    Player.js
    Enemy.js
    Bullet.js
    PowerUp.js
    Particle.js
    Collision.js
    GameEngine.js
  hooks/
    useGame.js
    useSound.js
  utils/
    storage.js
  App.jsx
  main.jsx
  index.css
```

## Game Architecture
- **`GameEngine.js`**: Core game loop using `requestAnimationFrame`. Owns game state (`menu/playing/paused/gameover`), entity lists (player, enemies, bullets, enemy bullets, power-ups, particles), spawning, difficulty/level progression, collision handling, scoring, rendering, pause/resume, and reset/restart logic.
- **Entities (`game/`)**: `Player`, `Enemy` (normal/fast/boss), `Bullet`, `PowerUp`, and `Particle` encapsulate update/draw/behavior. `Collision.js` provides rectangle intersection utilities.
- **React integration (`hooks/useGame.js`)**: Binds a `<canvas>` to the engine, handles DPR-aware resizing, bridges engine stats/state to React via callbacks, and exposes controls (start/pause/resume/restart/menu/input).
- **Audio (`hooks/useSound.js`)**: Web Audio API-based SFX and background drone with mute support.
- **Persistence (`utils/storage.js`)**: LocalStorage helpers for top 5 high scores and sound settings.
- **UI (`components/`)**: Menu/overlays/HUD rendered in React/Tailwind layered over the canvas; `GameCanvas` handles keyboard/mouse/touch input and mobile controls.

## Controls
- **Move**: Left/Right Arrow or A/D (or mouse hover / touch drag over canvas)
- **Shoot**: Spacebar (or on-screen fire button on mobile)
- **Pause/Resume**: P or Esc, or Pause button
- **Mobile**: On-screen left/right and fire buttons

## Scoring & Progression
- Normal enemy: 10 pts, Fast enemy: 20 pts, Boss: 100 pts
- Difficulty and spawn rate increase with levels
- Boss fight every 5 levels
- Power-ups: Rapid fire, Shield, Health (random drops)

## Setup & Run
```bash
npm install
npm run dev
```
Then open the local URL shown by Vite (typically http://localhost:5173).

## Build for Production
```bash
npm run build
npm run preview
```
The production build outputs to `dist/`.

## Notes
- Runs entirely in the browser (no backend).
- Visuals are generated with Canvas/CSS (no copyrighted assets).
- Audio uses the Web Audio API; browsers may require a user interaction (e.g. clicking Play) before sound starts.
