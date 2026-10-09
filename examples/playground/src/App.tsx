import { useState } from "react";
import {
  AdSlot,
  BannerAd,
  BrandedBanner,
  CustomBanner,
  MediaBanner,
  ThemeProvider,
  type BannerConfig,
  type ThemeMode,
} from "brand-banners";

const rotatingAds: BannerConfig[] = [
  {
    id: "rot-1",
    title: "Tip 1 — Write the test first",
    subtitle: "It's faster than you think.",
    cta: { label: "Read", href: "#" },
  },
  {
    id: "rot-2",
    title: "Tip 2 — Name things by what they do",
    subtitle: "Not by what they are.",
    cta: { label: "Read", href: "#" },
    bg: "brand",
  },
  {
    id: "rot-3",
    title: "Tip 3 — Optimize for delete-ability",
    subtitle: "The best code is the code you removed.",
    cta: { label: "Read", href: "#" },
  },
];

export function App() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  return (
    <ThemeProvider mode={theme}>
      <header className="app-header">
        <div>
          <h1>brand-banners</h1>
          <p>Live playground · {theme}</p>
        </div>
        <div className="theme-toggle">
          {(["light", "dark", "system"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTheme(m)}
              data-active={theme === m}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <main className="app-main">
        <section>
          <h2>BannerAd — neutral surface</h2>
          <BannerAd
            id="demo-1"
            title="Save 20% on my new course"
            subtitle="Learn React + TypeScript in 30 days"
            cta={{ label: "Get it", href: "#" }}
            dismissible
          />
        </section>

        <section>
          <h2>BannerAd — brand gradient (the &quot;Get 20% off&quot; vibe)</h2>
          <BannerAd
            id="demo-2"
            eyebrow="LAUNCH WEEK"
            title="Build it in a weekend"
            subtitle="Self-host the whole thing."
            cta={{ label: "Start free", href: "#" }}
            bg="brand"
            finePrint="Free forever for hobby projects."
          />
        </section>

        <section>
          <h2>BrandedBanner — leaderboard (930 × 180)</h2>
          <BrandedBanner
            id="demo-3"
            eyebrow="NEW"
            title="Save 50% on ink"
            subtitle="Print smarter."
            finePrint="Free delivery incl.*"
            cta={{ label: "Shop", href: "#" }}
            image="https://placehold.co/280x280/0F3D38/B6F23D.png?text=ink&font=inter"
            size="leaderboard"
          />
        </section>

        <section>
          <h2>BrandedBanner — halfpage (300 × 600), custom brand palette</h2>
          <BrandedBanner
            id="demo-4"
            eyebrow="LIMITED"
            title="Launch event tickets"
            subtitle="Three speakers. One night."
            cta={{ label: "Get your seat", href: "#" }}
            image="https://placehold.co/240x320/7C4DFF/EAF0F2.png?text=event&font=inter"
            size="halfpage"
            brandColors={{ bg: "#1A1133", accent: "#B6F23D", text: "#F3FBF7" }}
            layout="image-bg"
          />
        </section>

        <section>
          <h2>MediaBanner — image hero (replace with mp4 for video)</h2>
          <MediaBanner
            id="demo-5"
            title="See the course in 15 seconds"
            subtitle="Real code, no fluff."
            cta={{ label: "Watch the preview", href: "#" }}
            media={{
              type: "image",
              src: "https://placehold.co/320x180/0B2E2A/B6F23D.png?text=15s&font=inter",
              alt: "Course preview",
            }}
          />
        </section>

        <section>
          <h2>CustomBanner — fully composed from slots</h2>
          <CustomBanner id="demo-6" dismissible>
            <CustomBanner.Body>
              <CustomBanner.Eyebrow>RECIPE</CustomBanner.Eyebrow>
              <CustomBanner.Title>Anything you want, in your own markup.</CustomBanner.Title>
              <CustomBanner.Subtitle>
                Slots handle layout / theme / a11y; the creative is yours.
              </CustomBanner.Subtitle>
            </CustomBanner.Body>
            <CustomBanner.CTA label="Show me" href="#" />
            <CustomBanner.Close />
          </CustomBanner>
        </section>

        <section>
          <h2>AdSlot — rotating tips (8s interval, pause on hover)</h2>
          <AdSlot ads={rotatingAds} rotate={{ interval: 8000, pauseOnHover: true }} />
          <p className="hint">Hover the banner to pause auto-advance.</p>
        </section>

        <section>
          <h2>AdSlot — floating corner ad</h2>
          <p>(Look bottom-right of the viewport.)</p>
          <AdSlot position="corner" corner="bottom-right" offset={20}>
            <BannerAd
              id="corner-demo"
              title="Read this next →"
              cta={{ label: "Open", href: "#" }}
              dismissible
            />
          </AdSlot>
        </section>

        <div style={{ height: "40vh" }} />
      </main>

      <BannerAd
        id="sticky-bottom-demo"
        title="Newsletter — one practical tip every Monday"
        cta={{ label: "Subscribe", href: "#" }}
        bg="brand"
        position="bottom"
        sticky
        dismissible
        storage={typeof window !== "undefined" ? window.localStorage : undefined}
      />
    </ThemeProvider>
  );
}
