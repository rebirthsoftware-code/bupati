import Link from "next/link";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "./icons";
import { PawDecor } from "./paw-decor";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint-100 via-cream-100 to-cream-50">
      <PawDecor />
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="animate-fade-up">
          <span className="eyebrow">
            <PawIcon className="h-3.5 w-3.5" />
            {site.tagline}
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
            Minik dostlarınız <span className="text-mint-600">güvende</span>,
            <br className="hidden sm:block" /> siz de içiniz rahat.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Muayeneden cerrahiye, aşıdan pet kuaföre kadar her şey tek çatı altında. Uzman hekim kadromuz ve
            tam donanımlı kliniğimizle kedi, köpek ve egzotik dostlarınızın yanındayız.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink("Merhaba, randevu almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp'tan Randevu Al
            </a>
            <Link href="/hizmetler" className="btn-ghost">
              Hizmetleri İncele <span aria-hidden>🐾</span>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              { icon: "⏱️", title: "Aynı gün randevu", text: "Çoğu zaman aynı gün sıra bulunur" },
              { icon: "🧪", title: "Klinik içi laboratuvar", text: "Sonuçlar 20 dakikada" },
              { icon: "💬", title: "Canlı destek", text: "Sağ alttan bize yazın" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg shadow-soft">
                  <span aria-hidden>{item.icon}</span>
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink-900">{item.title}</span>
                  <span className="block text-xs text-ink-400">{item.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            {/* Arka halkalar */}
            <div className="absolute inset-0 rounded-full bg-mint-200/50" />
            <div className="absolute inset-6 rounded-full bg-white/60" />
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-mint-300 to-mint-100 shadow-lift" />

            {/* Sevimli sahne */}
            <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Kedi ve köpek illüstrasyonu">
              {/* Köpek */}
              <g transform="translate(58 118)">
                <ellipse cx="52" cy="112" rx="46" ry="10" fill="#0f4941" opacity=".12" />
                <path d="M18 62c0-24 16-42 34-42s34 18 34 42v28c0 16-15 26-34 26S18 106 18 90V62Z" fill="#fdeed8" />
                <path d="M14 40c-8-6-12 14-8 26 3 9 10 12 14 10 5-3 2-31-6-36Z" fill="#f8e0bf" />
                <path d="M90 40c8-6 12 14 8 26-3 9-10 12-14 10-5-3-2-31 6-36Z" fill="#f8e0bf" />
                <circle cx="38" cy="62" r="5" fill="#2f2c38" />
                <circle cx="39.6" cy="60.4" r="1.6" fill="#fff" />
                <circle cx="66" cy="62" r="5" fill="#2f2c38" />
                <circle cx="67.6" cy="60.4" r="1.6" fill="#fff" />
                <ellipse cx="52" cy="78" rx="8" ry="6" fill="#2f2c38" />
                <path d="M52 84v6M52 90c-4 6-12 4-12-2M52 90c4 6 12 4 12-2" stroke="#2f2c38" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M22 100h60v6c0 12-13 20-30 20s-30-8-30-20v-6Z" fill="#41c8a6" />
                <circle cx="52" cy="112" r="7" fill="#fa5738" />
              </g>

              {/* Kedi */}
              <g transform="translate(160 138)">
                <ellipse cx="42" cy="96" rx="40" ry="9" fill="#0f4941" opacity=".12" />
                <path d="M10 46c0-20 14-34 32-34s32 14 32 34v26c0 14-13 24-32 24s-32-10-32-24V46Z" fill="#fff8ee" />
                <path d="M12 30 8 4l22 12ZM72 30l4-26-22 12Z" fill="#fff8ee" />
                <path d="M14 26 12 12l12 7ZM70 26l2-14-12 7Z" fill="#ffcdc4" />
                <path d="M30 48c0 3-2 6-5 6s-5-3-5-6 2-5 5-5 5 2 5 5ZM64 48c0 3-2 6-5 6s-5-3-5-6 2-5 5-5 5 2 5 5Z" fill="#2f2c38" />
                <circle cx="26.5" cy="46.5" r="1.5" fill="#fff" />
                <circle cx="60.5" cy="46.5" r="1.5" fill="#fff" />
                <path d="M42 60c-3 0-5 2-5 4 0 3 3 5 5 5s5-2 5-5c0-2-2-4-5-4Z" fill="#fa5738" />
                <path d="M42 69v4M42 73c-3 4-9 3-9-2M42 73c3 4 9 3 9-2" stroke="#2f2c38" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M6 56h16M6 62h16M62 56h16M62 62h16" stroke="#8c8a95" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M14 78h56v4c0 10-11 16-28 16s-28-6-28-16v-4Z" fill="#20ad8d" />
                <circle cx="42" cy="88" r="6" fill="#f8e0bf" />
              </g>
            </svg>

            {/* Yüzen rozetler */}
            <div className="absolute -left-2 top-10 animate-paw-float rounded-3xl bg-white px-4 py-3 shadow-lift sm:left-0">
              <p className="text-xs font-extrabold text-ink-900">🩺 Uzman hekim kadrosu</p>
              <p className="text-[11px] text-ink-400">12+ yıllık deneyim</p>
            </div>
            <div className="absolute -right-1 bottom-16 animate-paw-float rounded-3xl bg-white px-4 py-3 shadow-lift [animation-delay:1.4s] sm:right-0">
              <p className="text-xs font-extrabold text-ink-900">💚 9.000+ mutlu pati</p>
              <p className="text-[11px] text-ink-400">Sizi de bekliyoruz</p>
            </div>
            <div className="absolute bottom-2 left-8 animate-paw-float rounded-2xl bg-coral-400 px-4 py-2 text-white shadow-lift [animation-delay:2.2s]">
              <p className="text-xs font-extrabold">7/24 Acil Hat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
