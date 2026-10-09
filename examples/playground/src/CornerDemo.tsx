import { BrandBanners, type BannerConfig } from "brand-banners";

/**
 * The drop-in: one component, one array. Open with `?demo=corner`.
 *
 * The page deliberately styles bare `h2`, `a`, `button` and `img` the way a
 * typical site or starter template does, to show the banner holds its look.
 */
const ADS: readonly BannerConfig[] = [
  {
    id: "promo-course",
    eyebrow: "LEARN",
    title: "Master Next.js, project by project",
    subtitle: "Practical courses for shipping real apps.",
    cta: { label: "Start learning", href: "#course" },
    image: { src: "/trans-ads/gradcap_render.svg", alt: "", width: 512, height: 512 },
    brandColors: { bg: "#27272A", primary: "#000000", accent: "#38BDF8", text: "#FAFAFA" },
  },
  {
    id: "promo-payments",
    eyebrow: "PAYMENTS",
    title: "Accept Mobile Money in your app",
    subtitle: "MTN MoMo, Airtel & Stripe — one API.",
    cta: { label: "Try it", href: "#payments" },
    image: { src: "/trans-ads/smartphone_payment_render.svg", alt: "", width: 512, height: 512 },
    brandColors: { bg: "#7C3AED", primary: "#4C1D95", accent: "#C4B5FD", text: "#F5F3FF" },
  },
  {
    id: "promo-messaging",
    eyebrow: "BULK MESSAGING",
    title: "Bulk SMS & Email from one dashboard",
    subtitle: "Built for African senders.",
    cta: { label: "Start sending", href: "#messaging" },
    image: { src: "/trans-ads/envelope_render.svg", alt: "", width: 512, height: 512 },
    brandColors: { bg: "#0EA5E9", primary: "#0369A1", accent: "#7DD3FC", text: "#F0F9FF" },
  },
  {
    id: "promo-stack",
    eyebrow: "BATTERIES INCLUDED",
    title: "Auth, payments & more in one command",
    subtitle: "Components for Next.js, Expo & Go.",
    cta: { label: "See the stack", href: "#stack" },
    image: { src: "/trans-ads/stack_render.svg", alt: "", width: 512, height: 512 },
    brandColors: { bg: "#F59E0B", primary: "#B45309", accent: "#FCD34D", text: "#FFFBEB" },
  },
];

const HOSTILE_HOST_CSS = `
  h1, h2 { color: #08060d; font-family: Georgia, serif; font-weight: 500; }
  a { color: #aa3bff; text-decoration: underline; }
  button { background: #eee; color: #333; border: 2px solid #999; border-radius: 0; padding: 12px; }
  img { border: 3px dashed red; }
  p { color: #6b6375; }
`;

export function CornerDemo() {
  const interval = Number(new URLSearchParams(window.location.search).get("interval") ?? 10_000);
  return (
    <main className="app-main">
      <style>{HOSTILE_HOST_CSS}</style>
      <h1>Corner promo card</h1>
      <p>
        <code>{"<BrandBanners ads={ADS} />"}</code> — rotating, dismissible, remembered for 7 days.
        Clear <code>localStorage</code> to bring it back after closing.
      </p>
      <h2>A host page heading</h2>
      <p>
        This page styles bare <code>h2</code>, <code>a</code>, <code>button</code> and{" "}
        <code>img</code>. <a href="#x">A host link</a>. <button type="button">A host button</button>
      </p>
      <div style={{ height: "120vh" }} />
      <BrandBanners ads={ADS} interval={interval} />
    </main>
  );
}
