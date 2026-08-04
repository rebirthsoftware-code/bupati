import Link from "next/link";
import { Hero } from "@/components/hero";
import { PawTrail } from "@/components/paw-decor";
import { CtaBand, SectionHeading, ServiceCard, StatsBand, TestimonialCard } from "@/components/ui";
import { ProductCard } from "@/components/products/product-card";
import { FaqList } from "@/components/faq-list";
import { featuredServices } from "@/data/services";
import { products } from "@/data/products";
import { faqs, steps, testimonials } from "@/data/content";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "@/components/icons";

export default function HomePage() {
  const popular = products.filter((p) => p.badge === "Çok Satan" || p.badge === "Veteriner Önerisi").slice(0, 4);

  return (
    <>
      <Hero />

      {/* İstatistikler */}
      <section className="container-x -mt-8 relative z-10">
        <StatsBand />
      </section>

      {/* Hizmetler */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Dostunuzun ihtiyacı olan her şey tek çatı altında"
          description="Rutin kontrolden acil müdahaleye, tüm süreçlerde yanınızdayız. Tedavi planını her zaman sizinle birlikte, anlaşılır bir dille konuşuyoruz."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/hizmetler" className="btn-primary">
            Tüm Hizmetleri Gör <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Neden biz */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="paw-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Neden PatiCan?"
              title="Stressiz bir klinik deneyimi mümkün"
              description="Kliniğe gelmek dostunuz için korkutucu olmak zorunda değil. Kedi ve köpekler için ayrı bekleme alanları, feromon destekli sakinleştirici ortam ve sabırlı bir ekip."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { t: "Ayrı bekleme alanları", d: "Kedi ve köpekler karşılaşmadan bekler." },
                { t: "Şeffaf fiyatlandırma", d: "İşlem öncesi maliyeti net paylaşırız." },
                { t: "Dijital hasta dosyası", d: "Tüm geçmiş tek yerde saklanır." },
                { t: "Aşı hatırlatma", d: "Zamanı gelince WhatsApp'tan yazarız." },
                { t: "Tam donanımlı ameliyathane", d: "Canlı monitörizasyonla güvenli anestezi." },
                { t: "7/24 acil danışma", d: "Gece de olsa telefonumuz açık." },
              ].map((item) => (
                <li key={item.t} className="flex gap-3 rounded-3xl bg-cream-100 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-500 text-white">
                    <PawIcon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-ink-900">{item.t}</span>
                    <span className="block text-xs leading-relaxed text-ink-600">{item.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="card overflow-hidden p-0">
              <div className="bg-gradient-to-br from-mint-500 to-mint-600 px-7 py-8 text-white">
                <h3 className="font-display text-2xl font-bold text-white">Çalışma Saatlerimiz</h3>
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
              <div className="space-y-2 px-7 pb-7 pt-5">
                <a
                  href={whatsappLink("Merhaba, uygun randevu saatlerini öğrenebilir miyim?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Uygun Saatleri Sor
                </a>
                <a href={`tel:${site.phoneHref}`} className="btn-ghost w-full">
                  ☎ {site.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PawTrail />

      {/* Nasıl işliyor */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Nasıl işliyor?"
          title="Dört adımda, telaşsız"
          description="İlk mesajınızdan tedavi sonrası kontrole kadar süreci sizin için basitleştiriyoruz."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative card p-6 text-center">
              <span className="absolute -top-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-mint-500 text-sm font-extrabold text-white shadow-soft">
                {i + 1}
              </span>
              <span className="mt-3 block text-4xl" aria-hidden>
                {step.emoji}
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ürünler */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 py-16 sm:py-24">
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Pet Shop"
            title="Veteriner onaylı ürünler"
            description="Rafımızdaki her ürünü kendi hastalarımızda kullandığımız için öneriyoruz. Sitede online ödeme yok — beğendiğiniz ürünün butonuna basın, siparişinizi WhatsApp'tan tamamlayalım."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/urunler" className="btn-primary">
              Tüm Ürünleri Gör <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Yorumlar */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Pati sahipleri ne diyor?"
          title="Bize güvenen dostlarımız"
          description="Yorumların tamamı kliniğimize gelen hasta sahiplerinden."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* SSS */}
      <section className="section container-x">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            center={false}
            eyebrow="Sık sorulanlar"
            title="Aklınızdaki sorular"
            description="Cevabını bulamadığınız bir şey mi var? Sağ alttaki canlı destekten yazın, hemen yanıtlayalım."
          />
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBand />
      <div className="h-16" />
    </>
  );
}
