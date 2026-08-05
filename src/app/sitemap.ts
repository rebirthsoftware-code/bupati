import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = ["", "/hizmetler", "/urunler", "/hakkimizda", "/iletisim"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bupati.vercel.app";
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
