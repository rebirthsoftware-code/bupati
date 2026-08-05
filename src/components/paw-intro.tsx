"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { PawIcon } from "./icons";
import { site } from "@/data/site";

/**
 * Açılış animasyonu: ekranda bir pati sırayla adım adım yürür, ardından logo
 * belirir ve perde yukarı kalkarak siteyi açar.
 *
 * - Oturum başına yalnızca bir kez oynar (sessionStorage).
 * - "Hareketi azalt" tercihi açıksa hiç oynamaz.
 * - Ekrana tıklanınca atlanabilir.
 */

const KEY = "bupati.intro.seen";

/** Yürüyüş izi: sağ–sol dönüşümlü adımlar, soldan sağa tek tek basar */
const steps = Array.from({ length: 8 }, (_, i) => ({
  size: i % 2 === 0 ? 26 : 30,
  offsetY: i % 2 === 0 ? 0 : 14,
  rot: i % 2 === 0 ? -16 : 13,
  delay: 0.9 + i * 0.075,
}));

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function PawIntro() {
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");

  useIsoLayoutEffect(() => {
    let skip = false;
    try {
      skip =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.sessionStorage.getItem(KEY) === "1";
    } catch {
      skip = false;
    }

    if (skip) {
      setPhase("done");
      return;
    }

    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* gizli sekmede yazılamayabilir, sorun değil */
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leave = window.setTimeout(() => setPhase("leaving"), 2050);
    const finish = window.setTimeout(() => setPhase("done"), 2800);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(finish);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      onClick={() => setPhase("leaving")}
      role="presentation"
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mint-100 via-cream-100 to-cream-50 ${
        phase === "leaving" ? "animate-curtain-up" : ""
      }`}
    >
      <div className="paw-pattern absolute inset-0 opacity-50" />

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Logo */}
        <span
          className="grid h-20 w-20 animate-logo-pop place-items-center rounded-[1.75rem] bg-mint-500 text-white shadow-lift"
          style={{ animationDelay: "0.1s" }}
        >
          <PawIcon className="h-11 w-11" />
        </span>

        <p
          className="mt-5 animate-fade-up font-display text-3xl font-extrabold text-ink-900 sm:text-4xl"
          style={{ animationDelay: "0.4s" }}
        >
          {site.shortName}
        </p>
        <p
          className="mt-1.5 animate-fade-up text-[11px] font-extrabold uppercase tracking-[0.28em] text-mint-600"
          style={{ animationDelay: "0.55s" }}
        >
          Veteriner Kliniği
        </p>
        <p className="mt-4 animate-fade-up text-sm text-ink-400" style={{ animationDelay: "0.7s" }}>
          {site.tagline}
        </p>

        {/* Patiler soldan sağa yürür */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((step, i) => (
            <PawIcon
              key={i}
              className="animate-paw-step text-mint-400"
              style={{
                width: step.size,
                height: step.size,
                marginTop: step.offsetY,
                animationDelay: `${step.delay}s`,
                ["--paw-rot" as string]: `${step.rot}deg`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
