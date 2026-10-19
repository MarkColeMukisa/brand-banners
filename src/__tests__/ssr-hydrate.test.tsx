import { act } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrandBanners } from "../components/BrandBanners";
import { createExpiringStorage } from "../utils/storage";

const ads = [
  { id: "course", title: "Master React", cta: { label: "Enroll", href: "/course" } },
  { id: "brand", title: "Meet the brand", cta: { label: "Visit", href: "/brand" } },
];

let container: HTMLDivElement;
let root: Root | undefined;
let observer: MutationObserver;
// Every banner element ever inserted into the container, painted or not.
let inserted: Element[];

function collect(records: MutationRecord[]) {
  for (const record of records) {
    record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(".bb-banner")) inserted.push(node);
      inserted.push(...node.querySelectorAll(".bb-banner"));
    });
  }
}

/** Server-render `element`, then hydrate it, recording what React inserts. */
function serverThenHydrate(element: ReactElement) {
  container.innerHTML = renderToString(element);
  // jsdom has a `window`, so the server pass above picks `useLayoutEffect`
  // and React warns about it. A real server picks `useEffect` (see
  // ssr-server.test.tsx); only warnings from hydration count here.
  vi.mocked(console.error).mockClear();
  inserted = [];
  observer = new MutationObserver(collect);
  observer.observe(container, { childList: true, subtree: true });
  act(() => {
    root = hydrateRoot(container, element);
  });
  // Observer callbacks are async; pick up whatever is still queued.
  collect(observer.takeRecords());
}

describe("hydrating a server render", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = undefined;
    observer.disconnect();
    container.remove();
    consoleError.mockRestore();
  });

  it("shows the card after hydration, without a hydration warning", () => {
    serverThenHydrate(<BrandBanners ads={ads} />);
    expect(container.textContent).toContain("Master React");
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("never paints a slot the visitor closed, not even for one frame", () => {
    createExpiringStorage({ days: 7 })!.setItem("bb-dismissed:slot", "1");
    serverThenHydrate(<BrandBanners ads={ads} />);

    expect(container.querySelector(".bb-banner")).toBeNull();
    // The server HTML was empty, and hydration never inserted a banner.
    expect(inserted).toHaveLength(0);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('ssr="render" keeps the old behaviour: in the HTML, removed on hydration', () => {
    createExpiringStorage({ days: 7 })!.setItem("bb-dismissed:slot", "1");
    const element = <BrandBanners ads={ads} ssr="render" />;
    const html = renderToString(element);
    expect(html).toContain("Master React");

    serverThenHydrate(element);
    expect(container.querySelector(".bb-banner")).toBeNull();
  });

  it("hydrates a showAfter slot without a warning", () => {
    vi.useFakeTimers();
    try {
      serverThenHydrate(<BrandBanners ads={ads} showAfter={500} />);
      expect(container.querySelector(".bb-banner")).toBeNull();
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(container.textContent).toContain("Master React");
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
