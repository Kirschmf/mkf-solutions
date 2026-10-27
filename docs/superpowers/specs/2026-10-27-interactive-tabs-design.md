# Interactive selectors — MKF Solutions

Extend the approved blue/navy site with motion that responds to selection, pointer and keyboard. Keep the hero composition, portrait, typography, section layouts and all existing business/demo state.

## Visual direction

- Palette: navy `#0D101D`, raised navy `#142343`, royal blue `#2548F4`, blue `#15378D`, light blue `#A9D7FF`, warm white `#F3EEE7`.
- Type: existing Instrument Serif headings and existing sans-serif controls. No new font or decorative label.
- Layout: existing left-aligned content and responsive rows/grids. An absolute selection layer follows each actual control, including wrapped rows on mobile.
- Hierarchy: blue fill for service, career, process, route and briefing choices; a precise light-blue underline for navigation and profile perspectives. No looping decoration.

```text
pointer → subtle hover light
[ choice A ][ SELECTED B ][ choice C ]
                └ blue layer travels from the previous choice
                └ content enters in the direction of the choice
click/tap → short localized light ripple
```

## References inspected

- https://animate-ui.com/docs/primitives/animate-ui/tabs — travelling highlight, directional panels, keyboard and reduced motion.
- https://ui.aceternity.com/components/tabs — shared selection feedback and panel transitions.
- https://magicui.design/docs/components/ripple-button — localized click feedback.
- https://motion.dev/examples/react-shared-layout-animation — shared active underline.

Implement original code with existing GSAP. No component-library source, dependency or visual asset is copied.

## Interaction contract

Cover all eight groups: main navigation, hero needs, services, workflow routes, profile perspectives, career, process, briefing needs. Preserve native button/link semantics, existing ARIA states, keyboard handlers, focus, shared need state, hidden workflow panels and form validation. Hover never changes selection. Decorative layers never receive pointer events or focus. Geometry follows resize, font loading and mobile menu visibility. Rapid selection cancels the previous transition. Reduced motion snaps to the final selection and clears transient effects.

## Design review

The existing portrait and editorial hero remain the memorable composition. Selection motion communicates what changed in an operational portfolio; it does not add an unrelated visual theme. Use blue fill only on selected controls, with white selected text. Avoid bouncy movement and independently floating buttons. Entry transforms belong to the existing reveal system; the new component animates its own decorative layers only.
