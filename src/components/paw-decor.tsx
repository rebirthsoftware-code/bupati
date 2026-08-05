import { PawIcon } from "./icons";

type Paw = { top: string; left: string; size: number; rotate: number; delay: number; opacity: number };

const paws: Paw[] = [
  { top: "8%", left: "6%", size: 46, rotate: -20, delay: 0, opacity: 0.18 },
  { top: "22%", left: "88%", size: 34, rotate: 24, delay: 1.2, opacity: 0.16 },
  { top: "62%", left: "3%", size: 28, rotate: 12, delay: 2.1, opacity: 0.14 },
  { top: "78%", left: "80%", size: 52, rotate: -14, delay: 0.6, opacity: 0.12 },
  { top: "44%", left: "94%", size: 22, rotate: 40, delay: 1.8, opacity: 0.14 },
  { top: "88%", left: "38%", size: 26, rotate: -32, delay: 2.6, opacity: 0.1 },
];

/** Sayfa arka planında yüzen tatlı pati izleri */
export function PawDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {paws.map((paw, i) => (
        <PawIcon
          key={i}
          className="absolute animate-paw-float text-mint-500"
          style={{
            top: paw.top,
            left: paw.left,
            width: paw.size,
            height: paw.size,
            opacity: paw.opacity,
            animationDelay: `${paw.delay}s`,
            ["--paw-rot" as string]: `${paw.rotate}deg`,
            transform: `rotate(${paw.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * İki bölüm arasına yerleşen pati izi şeridi.
 * Ekrana girdiğinde patiler soldan sağa tek tek "yürüyerek" belirir.
 */
export function PawTrail({ count = 7 }: { count?: number }) {
  return (
    <div className="paw-trail flex items-center justify-center gap-3 py-2" data-reveal aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <PawIcon
          key={i}
          data-paw=""
          className="text-mint-300"
          style={{
            width: 16 + (i % 3) * 4,
            height: 16 + (i % 3) * 4,
            transitionDelay: `${i * 90}ms`,
            ["--paw-rot" as string]: `${i % 2 === 0 ? -18 : 14}deg`,
            ["--paw-y" as string]: `${i % 2 === 0 ? 0 : 8}px`,
            ["--paw-op" as string]: `${0.35 + (i % 4) * 0.12}`,
          }}
        />
      ))}
    </div>
  );
}
