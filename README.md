# Outside the Lines

An outdoor story whose missing artifacts must be discovered in the real world.

## Open AI

Photo interpretation runs in the browser with the open CLIP model `Xenova/clip-vit-base-patch32` through Transformers.js. The model is downloaded on first use and cached by the browser. If it cannot load, the player can describe the discovery manually and the story remains playable.

No proprietary AI API is required by the application.

## Animated scene direction

Each chapter is staged as a lightweight hand-drawn CSS/SVG comic scene. Barnaby launches and crash-lands, Leo and Billy loop around a boulder, and Maya chases a windblown canvas downhill. Characters blink, anticipate, stretch, recoil, run, and react with eased body motion and timed comic sound effects. Motion can be paused and is automatically disabled when the device requests reduced motion.

Three complete adventures share the same outdoor-discovery mechanic while providing distinct narrative arcs, missions, artifact vocabularies, palettes, and endings: *Barnaby’s Great Bush Disaster*, *Leo and the Lunch-Lover*, and *Maya’s Flying Masterpiece*.

The theme picker uses the supplied three-panel comic artwork as a visual story selector. Every story then unfolds through three deeper chapters and asks the player to step outside for three safe, non-destructive photo discoveries that change the next chapter and final keepsake.

Players may optionally download `onnx-community/gemma-3-270m-it-ONNX` to let the open-weight Gemma model choose a chapter's atmospheric direction. Gemma runs in the browser through Transformers.js; the default handcrafted animations do not wait for it.

## Run locally

Serve the `dist` directory with any static web server. Camera capture requires HTTPS or localhost.

## Privacy

- No accounts or location tracking.
- Photos are passed directly to the local browser model.
- Object URLs and story state remain in the current browser session.
- No photo upload endpoint exists.

## Current scope

- Three complete stories with three chapters each
- Three real-world discovery missions
- Local zero-shot image interpretation
- Personalized artifact names and story continuation
- Installable offline-ready shell
