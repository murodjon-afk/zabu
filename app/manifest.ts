import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZABU — Учись без границ",
    short_name: "ZABU",
    description: "Изучай языки вместе с ZABU",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F6F9F7",
    theme_color: "#D9F36B",

    icons: [
      {
        src: "/app-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}