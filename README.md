# Outside the Lines

An outdoor story whose missing artifacts must be discovered in the real world.

## Open AI

Photo interpretation runs in the browser with the open CLIP model `Xenova/clip-vit-base-patch32` through Transformers.js. The model is downloaded on first use and cached by the browser. If it cannot load, the player can describe the discovery manually and the story remains playable.

No proprietary AI API is required by the application.

## Run locally

Serve the `dist` directory with any static web server. Camera capture requires HTTPS or localhost.

## Privacy

- No accounts or location tracking.
- Photos are passed directly to the local browser model.
- Object URLs and story state remain in the current browser session.
- No photo upload endpoint exists.

## Current scope

- One complete story: *The Forest That Forgot*
- Three real-world discovery missions
- Local zero-shot image interpretation
- Personalized artifact names and story continuation
- Installable offline-ready shell
