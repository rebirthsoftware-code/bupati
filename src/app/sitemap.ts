import type { MetadataRoute } from "next";

const routes = ["", "/hizmetler", "/urunler", "/hakkimizda", "/iletisim"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paticanveteriner.vercel.app";
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
