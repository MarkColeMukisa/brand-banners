import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CornerDemo } from "./CornerDemo";
import "./styles.css";

// `?demo=corner` shows the drop-in on its own; the default page tours every component.
const demo = new URLSearchParams(window.location.search).get("demo");

createRoot(document.getElementById("root")!).render(
  <StrictMode>{demo === "corner" ? <CornerDemo /> : <App />}</StrictMode>,
);
