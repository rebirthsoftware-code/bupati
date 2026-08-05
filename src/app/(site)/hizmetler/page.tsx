import type { Metadata } from "next";
import { CtaBand, PageHero, SectionHeading, ServiceCard } from "@/components/ui";
import { FaqList } from "@/components/faq-list";
import { PawTrail } from "@/components/paw-decor";
import { services } from "@/data/services";
import { faqs } from "@/data/content";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Muayene, aşı, cerrahi, laboratuvar, görüntüleme, diş sağlığı, pet kuaför, mikroçip ve acil servis. BuPati Veteriner Kliniği'nin tüm hizmetleri.",
};

const groups = [
  { title: "Sağlık & Tedavi", slugs: ["genel-muayene", "asi-parazit", "dahiliye", "acil"] },
  { title: "Cerrahi & Tanı", slugs: ["cerrahi", "laboratuvar", "goruntuleme", "dis-sagligi"] },
  { title: "Bakım & Diğer", slugs: ["pet-kuafor", "mikrocip-pasaport", "egzotik", "evde-bakim"] },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetlerimiz"
        title="Patilerin ihtiyacı olan her şey, aynı çatı altında"
        description="Koruyucu hekimlikten ileri cerrahiye kadar 12 farklı hizmet başlığında, tam donanımlı kliniğimizde hizmet veriyoruz."
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink("Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Hizmet Hakkında Sor
          </a>
          <a href={`tel:${site.phoneHref}`} className="btn-ghost">
            ☎ {site.phoneDisplay}
          </a>
        </div>
      </PageHero>

      {groups.map((group, gi) => (
        <section key={group.title} className={gi === 0 ? "section container-x" : "container-x pb-16 sm:pb-24"}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mint-100 text-mint-600">
              <PawIcon className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-extrabold sm:text-3xl">{group.title}</h2>
            <span className="h-px flex-1 bg-cream-200" aria-hidden />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {group.slugs.map((slug, i) => {
              const service = services.find((s) => s.slug === slug);
              return service ? <ServiceCard key={slug} service={service} index={i} /> : null;
            })}
          </div>
        </section>
      ))}

      <PawTrail />

      <section className="section container-x">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            center={false}
            eyebrow="Sık sorulanlar"
            title="Merak edilenler"
            description="Aradığınız cevabı bulamadıysanız canlı destekten yazın; ekibimiz yanıtlasın."
          />
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBand
        title="Hangi hizmete ihtiyacınız olduğundan emin değil misiniz?"
        text="Dostunuzun durumunu bize kısaca anlatın; hangi muayeneye ihtiyaç duyduğunu birlikte belirleyelim."
      />
      <div className="h-16" />
    </>
  );
}
