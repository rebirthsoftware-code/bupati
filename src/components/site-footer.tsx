import Link from "next/link";
import { nav, site, whatsappLink } from "@/data/site";
import { services } from "@/data/services";
import { PawIcon, WhatsAppIcon } from "./icons";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-900 text-cream-100">
      <div className="paw-pattern pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-500 text-white">
                <PawIcon className="h-6 w-6" />
              </span>
              <span className="font-display text-2xl font-extrabold text-white">{site.shortName}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
              {site.tagline}. Kedi, köpek ve egzotik dostlarınız için şefkatli ve bilimsel veteriner hekimliği.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { href: site.social.instagram, label: "Instagram", icon: "📷" },
                { href: site.social.facebook, label: "Facebook", icon: "👍" },
                { href: site.social.youtube, label: "YouTube", icon: "▶️" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:bg-mint-500"
                >
                  <span aria-hidden>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-white">Sayfalar</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-100/70">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Panel yalnızca sunuculu derlemede (Vercel) yayında olur */}
              {process.env.NEXT_PUBLIC_STATIC_DEMO !== "1" && (
                <li>
                  <Link href="/admin" className="link-underline hover:text-white">
                    Yönetim Paneli
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-white">Hizmetler</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-100/70">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/hizmetler#${s.slug}`} className="link-underline hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-white">İletişim</h3>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/70">
              <li className="flex gap-2">
                <span aria-hidden>📍</span>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {site.address}
                </a>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>☎️</span>
                <a href={`tel:${site.phoneHref}`} className="hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>✉️</span>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
            </ul>
            <a
              href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-5 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp'tan Yaz
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream-100/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
          </p>
          <p className="flex items-center gap-1.5">
            Patilere sevgiyle <span aria-hidden>🐾</span> yapıldı
          </p>
        </div>
      </div>
    </footer>
  );
}
