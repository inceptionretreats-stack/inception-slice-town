# Slice Town

A standalone React + Vite restaurant website recreated from the supplied `135027` video frames. The layout follows the orange pizza-and-hand hero, floating navigation, checkerboard transitions, photographic collage, brown menu, cream top picks, offers, reservation form, testimonial notes, locations and footer.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

Requires Node.js 22.12+ and npm. Vercel can use the Vite preset, build command `npm run build`, output `dist`.

During local preparation, `node_modules` is an ignored Windows junction to the existing workspace dependencies. It is not part of the project source. The committed package and lockfile support a clean installation elsewhere.

## Interactions

- Pizza/burger mode changes the hero, full menu and top picks. Burger copy and the alternate burger photograph extend the pizza-only video reference.
- Floating navigation and the mobile menu reach the matching page sections.
- Menu prices and top-pick ordering buttons add the selected size to the order drawer. Pickup/delivery, quantities and totals update locally. Escape, close and backdrop dismissal work through a native dialog.
- The reservation form validates required fields, email, phone, service hours and a future date/time. Confirmation is explicitly a local preview.
- Offers can be scrolled or moved with arrow controls; the page respects reduced motion.
- The reference choreography includes a pinned hero, diagonal slice pull, opposing scroll-driven headline rows, ingredient parallax, a travelling tilted-photo strip, staggered menu prices and products, and form/testimonial entrances. Offscreen strips pause; scroll work is batched into one frame only when needed. Reduced motion removes the pinning and choreography while keeping all content and controls available.

**There is no checkout, payment processing, real ordering or reservation service.** Neither form sends messages or personal information. Contact information and promotional content are reproduced as part of the reference design, not verified business details.

See [ASSETS.md](ASSETS.md) for the downloaded imagery and fonts. All interface code is newly authored React; no Framer runtime, compiled site source or sales chrome is included.
