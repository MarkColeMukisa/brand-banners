# Playground

Live demo of every component in light / dark / system themes.

```bash
cd examples/playground
npm install
npm run dev
```

- `/` tours every component.
- `/?demo=corner` shows the `<BrandBanners>` drop-in on a page whose own CSS styles bare `h2`, `a`, `button` and `img`, to check the card holds its look. Add `&interval=2000` to rotate faster.

The Vite dev server aliases `brand-banners` to the parent repo's source — edits to `../../src` hot-reload in the browser.
