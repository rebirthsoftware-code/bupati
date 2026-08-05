import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { AppointmentForm } from "@/components/appointment-form";
import { FaqList } from "@/components/faq-list";
import { faqs } from "@/data/content";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "İletişim & Randevu",
  description:
    "BuPati Veteriner Kliniği adres, telefon, çalışma saatleri ve WhatsApp randevu formu. Acil durumlar için 7/24 telefon desteği.",
};

const channels = [
  {
    emoji: "💬",
    title: "WhatsApp",
    value: site.phoneDisplay,
    text: "En hızlı yanıt. Randevu, ürün ve genel sorular için.",
    href: whatsappLink("Merhaba, bilgi almak istiyorum."),
    cta: "WhatsApp'tan yaz",
  },
  {
    emoji: "☎️",
    title: "Telefon",
    value: site.phoneDisplay,
    text: "Acil durumlarda gece gündüz arayabilirsiniz.",
    href: `tel:${site.phoneHref}`,
    cta: "Hemen ara",
  },
  {
    emoji: "✉️",
    title: "E-posta",
    value: site.email,
    text: "Belge, tahlil sonucu ve kurumsal işbirlikleri için.",
    href: `mailto:${site.email}`,
    cta: "E-posta gönder",
  },
  {
    emoji: "📍",
    title: "Adres",
    value: site.address,
    text: "Klinik önünde ücretsiz park alanı bulunur.",
    href: site.mapsUrl,
    cta: "Yol tarifi al",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize ulaşmanın en kolay yolu"
        description="Randevu almak, ürün sipariş etmek ya da sadece bir soru sormak için aşağıdaki kanallardan birini seçin. Sağ alttaki canlı destek de her zaman açık."
      />

      <section className="container-x -mt-6 relative z-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="card group flex flex-col p-6 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span className="text-3xl" aria-hidden>
                {c.emoji}
              </span>
              <h2 className="mt-3 text-lg font-bold">{c.title}</h2>
              <p className="mt-1 break-words text-sm font-semibold text-mint-600">{c.value}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{c.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-ink-900 transition group-hover:gap-3">
                {c.cta} <span aria-hidden>→</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section container-x">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AppointmentForm />

          <div className="space-y-6" data-reveal>
            <div className="card overflow-hidden p-0">
              <div className="bg-gradient-to-br from-mint-500 to-mint-600 px-7 py-6 text-white">
                <h2 className="font-display text-xl font-bold text-white">Çalışma Saatleri</h2>
                <p className="mt-1 text-sm text-mint-100">{site.emergencyNote}</p>
              </div>
              <ul className="divide-y divide-cream-200">
                {site.hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between px-7 py-4 text-sm">
                    <span className="font-bold text-ink-800">{h.day}</span>
                    <span className="text-ink-600">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card overflow-hidden p-0">
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-mint-200 to-cream-200">
                <div className="paw-pattern absolute inset-0 opacity-60" aria-hidden />
                <div className="relative text-center">
                  <PawIcon className="mx-auto h-10 w-10 text-mint-600" />
                  <p className="mt-2 font-display text-lg font-bold text-ink-900">{site.shortName}</p>
                  <p className="mx-auto mt-1 max-w-[16rem] text-xs text-ink-600">{site.address}</p>
                </div>
              </div>
              <div className="p-5">
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  📍 Google Haritalar'da Aç
                </a>
              </div>
            </div>

            <div className="card bg-coral-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-coral-700">
                <span aria-hidden>🚨</span> Acil bir durum mu var?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Zehirlenme, travma, nefes darlığı veya doğum güçlüğü gibi durumlarda önce telefonla arayın.
                Siz yola çıkarken biz hazırlık yapalım.
              </p>
              <a href={`tel:${site.phoneHref}`} className="btn-coral mt-4 w-full">
                ☎ Acil Hattı Ara — {site.phoneDisplay}
              </a>
              <a
                href={whatsappLink("Acil bir durumum var, yardımcı olabilir misiniz?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-2 w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp'tan Acil Yaz
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-2xl font-extrabold sm:text-3xl">Sık Sorulan Sorular</h2>
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
