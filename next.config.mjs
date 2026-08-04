/**
 * İki derleme modu:
 *  - Varsayılan (Vercel / kendi sunucunuz): canlı destek API'leri ve yönetim paneli dahil.
 *  - STATIC_EXPORT=1 (GitHub Pages): sunucusuz statik dışa aktarım. API uçları ve panel
 *    bu modda derlemeye dahil edilmez; sohbet balonu tanıtım (demo) modunda çalışır.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

// GitHub Pages proje sitesi https://<kullanici>.github.io/<repo>/ altında yayınlanır.
const basePath = isStatic ? (process.env.BASE_PATH ?? "/bupati") : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
