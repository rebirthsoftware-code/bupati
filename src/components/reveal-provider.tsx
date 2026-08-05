"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * `data-reveal` taşıyan öğeler ekrana girdiğinde yumuşakça belirir.
 * Gözlemci desteklenmiyorsa ya da JS geç yüklenirse öğeler görünür kalır
 * (globals.css içinde güvenlik ağı var).
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
    );
    if (!elements.length) return;

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("is-revealed");
          observer.unobserve(el);

          // Kart dizilerinde sıralı beliriş için gecikme veriliyor; beliriş
          // bittikten sonra gecikmeyi kaldırıyoruz ki hover animasyonu anında olsun.
          if (el.style.transitionDelay) {
            timers.push(
              window.setTimeout(() => {
                el.style.transitionDelay = "";
              }, 1400)
            );
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  return null;
}
