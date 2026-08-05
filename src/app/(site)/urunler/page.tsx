import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/ui";
import { ProductExplorer } from "@/components/products/product-explorer";
import { PawIcon, WhatsAppIcon } from "@/components/icons";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Veteriner onaylı mama, vitamin, parazit koruma, bakım ürünleri, oyuncak ve kedi kumu. Online ödeme yok; sipariş WhatsApp üzerinden tamamlanır.",
};

const steps = [
  { emoji: "🛍️", title: "Ürünü seçin", text: "Filtreleri kullanarak dostunuza uygun ürünü bulun." },
  { emoji: "💬", title: "WhatsApp'a basın", text: "Ürün bilgisi hazır mesaj olarak bize ulaşır." },
  { emoji: "📦", title: "Teslim alın", text: "Klinikten teslim ya da bölge içi kurye ile kapınıza." },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Pet Shop"
        title="Veteriner hekim onaylı ürünler"
        description="Rafımızdaki her ürünü kendi hastalarımızda kullandığımız için öneriyoruz. Sitede online ödeme yok — sipariş ve stok bilgisini WhatsApp'tan hızlıca netleştiriyoruz."
      >
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className="card p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {s.emoji}
                </span>
                <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-extrabold text-mint-700">
                  {i + 1}. adım
                </span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-ink-900">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.text}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="container-x py-12 sm:py-16">
        <ProductExplorer />
      </section>

      <section className="container-x">
        <div className="card flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-coral-100 text-coral-500">
            <PawIcon className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Aradığınız ürün listede yok mu?</h2>
            <p className="mt-1 text-sm text-ink-600">
              Reçeteli mamalar ve özel ürünler için bize yazın; stoğa alalım ya da uygun alternatifi önerelim.
              Klinik danışmanlığı ücretsizdir.
            </p>
          </div>
          <a
            href={whatsappLink(`Merhaba ${site.shortName}, listede olmayan bir ürün arıyorum:`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp shrink-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Ürün Talebi Gönder
          </a>
        </div>
      </section>

      <div className="h-16" />
      <CtaBand
        title="Sipariş ve stok için tek mesaj yeterli"
        text="Ürünün stok durumunu, teslimat seçeneklerini ve dostunuza uygun dozu WhatsApp'tan hemen paylaşıyoruz."
      />
      <div className="h-16" />
    </>
  );
}
