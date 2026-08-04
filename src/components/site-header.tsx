"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="hidden bg-mint-600 py-2 text-center text-xs font-semibold text-mint-50 sm:block">
        <div className="container-x flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span aria-hidden>📍</span>
            {site.address}
          </span>
          <span className="flex items-center gap-4">
            <a className="hover:text-white" href={`tel:${site.phoneHref}`}>
              ☎ {site.phoneDisplay}
            </a>
            <span className="hidden md:inline text-mint-100">{site.emergencyNote}</span>
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-cream-50/90 shadow-soft backdrop-blur-md" : "bg-cream-50/60 backdrop-blur-sm"
        }`}
      >
        <div className="container-x flex h-[74px] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label={site.name}>
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-mint-500 text-white shadow-soft transition group-hover:rotate-6">
              <PawIcon className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-extrabold text-ink-900">{site.shortName}</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mint-600">
                Veteriner Kliniği
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active ? "bg-mint-100 text-mint-700" : "text-ink-600 hover:bg-white hover:text-mint-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink(`Merhaba, ${site.name} için randevu almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp hidden !px-5 !py-2.5 sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Randevu Al
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menüyü aç"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-cream-200 bg-white text-ink-800 lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-all ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-3 top-[92px] animate-pop-in rounded-4xl border border-white bg-cream-50 p-5 shadow-lift">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-base font-bold ${
                    pathname === item.href ? "bg-mint-100 text-mint-700" : "text-ink-800 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid gap-2">
              <a
                href={whatsappLink(`Merhaba, ${site.name} için randevu almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp'tan Randevu
              </a>
              <a href={`tel:${site.phoneHref}`} className="btn-ghost w-full">
                ☎ {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
