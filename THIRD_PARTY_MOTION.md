# Third-party components and motion references

## Spell UI

Copy Button and Keyboard Shortcuts adapted from the official registries on 26/10/2026:

- https://spell.sh/r/copy-button.json
- https://spell.sh/r/kbd.json
- https://github.com/xxtomm/spell-ui

Copy Button now awaits clipboard success and reports failure. Keyboard controls stay scoped to the focused portfolio. The earlier Blur Reveal, Tilt Card and Background Paths components were removed.
MIT License

Copyright (c) 2025 Spell UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Original motion and references

The portfolio geometry/navigation and workflow state engine were implemented for MKF Solutions. References for the carousel interaction: https://truthcommerce.com.br, https://21st.dev/@hyperiux/components/arc-flow-carousel and https://codepen.io/Prowhiz/pen/PwovQNP. No Truth Commerce source, third-party project images or commercial metrics were transplanted.

Workflow connection references: https://reactflow.dev/examples/edges/animating-edges and https://magicui.design/docs/components/animated-beam. Connections animate actual transitions in the local demonstration.

## Hero editorial references — 27/10/2026

References supplied by the user and inspected as video frames:

- [Portfolio Animation: Showcase Your Creativity in Motion](https://dribbble.com/shots/25949833-Portfolio-Animation-Showcase-Your-Creativity-in-Motion), Mir Mamunur Rashid: central visual, navy palette and staged composition changes.
- [Personal Portfolio Website — Animations](https://dribbble.com/shots/26995447-Personal-Portfolio-Website-Animations), Dymas Alfin / Mikan Team: personal name, portrait and sequential entrance.
- [Luxury Portfolio Animation](https://dribbble.com/shots/27214848-Luxury-Portfolio-Animation), Andrej Krajčir: editorial serif typography, layered imagery and different scroll speeds.

MKF implementation uses its own GSAP timeline, scroll behavior, supplied portrait and project screenshots. Reference images/videos are research material only and are not distributed in the application. The transparent portrait is a local segmentation of the original supplied photo; no generated face or clothing. Instrument Serif is hosted locally from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/instrumentserif), with its OFL in `public/fonts/Instrument-Serif-OFL.txt`.

## Motion beyond the hero — 27/10/2026

The same three references were revisited for the remaining sections. The first reference informed the order of panel and text entrances (3.8–9.5 s). The personal portfolio informed service rows, staggered experience entries and the closing composition (8.5–16.25 s). The luxury portfolio informed restrained image layering (3–5 and 9.8–11.8 s).

The MKF implementation is original GSAP/ScrollTrigger code: masked heading lines, sequential control groups, image reveal and 24 px desktop parallax, local selection transitions, FAQ height changes and directional briefing steps. No reference source code, video or imagery is shipped. Existing hero behavior is preserved; the later removal of all project showcases and assets is preserved as well. Research files and QA captures stay outside the production bundle.

## Interactive selectors — 27/10/2026

Component references inspected for all eight navigation/selection groups:

- [Animate UI Tabs](https://animate-ui.com/docs/primitives/animate-ui/tabs): travelling selection highlight, directional panels and keyboard behavior.
- [Aceternity Animated Tabs](https://ui.aceternity.com/components/tabs): shared selection feedback and content transitions.
- [Magic UI Ripple Button](https://magicui.design/docs/components/ripple-button): click-local ripple feedback.
- [Motion shared layout example](https://motion.dev/examples/react-shared-layout-animation): moving active underline.

`InteractiveTabs` is original MKF code using the existing GSAP runtime; no reference implementation is copied and no new dependency is installed. It preserves direct native controls, ARIA and the existing state engines. Decorative active/hover/ripple layers have no pointer events. Selection geometry is recalculated on resize, font readiness and mobile-menu visibility. Reduced motion snaps selection immediately and removes transient effects. Existing panel motion now uses selection order for direction and excludes hidden workflow panels.

Image/font/section updates request [GSAP safe refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.refresh()/), preserving native smooth anchor navigation when the profile image finishes loading during the scroll. The installed GSAP 3.15 source confirms the delayed refresh waits for `scrollEnd` when scrolling is active.

## AI-generated imagery from the earlier visual pass

- public/assets/ai/hero-aurora.jpg and public/assets/ai/contact-texture.jpg were requested through Pollinations with `model=flux` on 27/10/2026 for MKF Solutions. Exact prompts, seeds, requested sizes and recorded processing are documented in [docs/content/ai-imagery.md](docs/content/ai-imagery.md). The aurora is no longer used in the redesigned hero. The contact texture remains decorative; portfolio evidence and the portrait are real assets.

## Runtime libraries and fonts

React, React DOM, Three.js, Motion, Lucide and React Flow retain their own licenses. GSAP uses its own license. Collected package notices are distributed in public/licenses/third-party-notices.txt. Font licenses are in public/fonts/*-OFL.txt.
