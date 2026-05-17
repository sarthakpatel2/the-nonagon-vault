// Injected once in the root via head() — but we also include a Link element here
// for client-side font preconnect on first hydration.
export const fontHeadLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Caveat:wght@400;700&display=swap",
  },
];
