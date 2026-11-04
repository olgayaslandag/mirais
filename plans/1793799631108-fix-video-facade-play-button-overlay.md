# Plan: Fix YouTube Facade Video Play Button Overlay

## Goal
Fix the `.video-facade` CSS rules in `app/globals.css` so that the play button (`.video-facade__play`) overlays on top of the thumbnail image rather than appearing beside it.

## Affected Boundaries
- `app/globals.css`: Update `.video-facade` and `.video-facade__play` styles (and ensure `.video-embed` if needed).

## Detailed Design / CSS Changes
1. **`.video-facade`**:
   - Set `position: relative`
   - Set `display: block` or `display: flex` / `display: inline-block` with explicit width/height or aspect ratio (e.g., `width: 100%`, `aspect-ratio: 16/9`, `overflow: hidden`, `border: 0`, `padding: 0`, `cursor: pointer`, background, border-radius).
2. **`.video-facade img`**:
   - Set `display: block`, `width: 100%`, `height: 100%`, `object-fit: cover`.
3. **`.video-facade__play`**:
   - Set `position: absolute`, `top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`.
   - Add styling for the play button circle (e.g., width/height, background color with opacity/transparency, border-radius: 50%, flex centering, text color / icon color, box-shadow or hover transition effects).
4. **`.video-embed`**:
   - Ensure iframe wrapper is styled properly (e.g., `position: relative`, `width: 100%`, `aspect-ratio: 16/9`, overflow, etc.) so embedded YouTube video scales correctly.

## Validation Plan
- Inspect generated CSS and code changes.
- Verify component structure in `YouTubeEmbed.tsx`.
- Run typechecking / build if applicable (`npm run build`).
