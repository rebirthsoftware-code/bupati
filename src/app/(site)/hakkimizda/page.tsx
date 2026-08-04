import type { Metadata } from "next";
import { CtaBand, PageHero, SectionHeading, StatsBand, TestimonialCard } from "@/components/ui";
import { PawTrail } from "@/components/paw-decor";
import { team, testimonials } from "@/data/content";
import { site } from "@/data/site";
import { PawIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "PatiCan Veteriner Kliniği'nin hikâyesi, uzman hekim kadrosu ve çalışma prensipleri. 12 yıldır patilerin yanındayız.",
};

const values = [
  {
    emoji: "🤍",
    title: "Şefkat önce gelir",
    text: "Her hasta bizim için bir aile üyesi. Acele etmeden, korkutmadan, sabırla yaklaşıyoruz.",
  },
  {
    emoji: "🔬",
    title: "Bilimsel yaklaşım",
    text: "Tanı koymadan tedaviye başlamıyoruz. Güncel literatürü ve kanıta dayalı protokolleri takip ediyoruz.",
  },
  {
    emoji: "💬",
    title: "Açık iletişim",
    text: "Hangi işlemin neden yapıldığını, ne kadar tutacağını işlemden önce sade bir dille anlatıyoruz.",
  },
  {
    emoji: "🌱",
    title: "Sürekli gelişim",
    text: "Ekibimiz her yıl kongre ve sertifika programlarıyla bilgisini tazeliyor.",
  },
];

const timeline = [
  { year: "2013", title: "İlk kapımızı açtık", text: "Kadıköy'de iki odalı küçük bir muayenehane olarak yola çıktık." },
  { year: "2016", title: "Laboratuvarımız kuruldu", text: "Kan ve idrar analizlerini kendi bünyemizde yapmaya başladık." },
  { year: "2019", title: "Ameliyathane ve yoğun bakım", text: "Tam donanımlı cerrahi ünitemiz hizmete girdi." },
  { year: "2022", title: "Pet kuaför & pet shop", text: "Bakım hizmetleri ve veteriner onaylı ürün rafımız eklendi." },
  { year: "2025", title: "Canlı destek hattı", text: "Sorularınızı siteden anında yanıtlayan destek ekibimiz kuruldu." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="12 yıldır patilerin yanındayız"
        description={`${site.name}, kedi ve köpeklerin stres yaşamadan tedavi olabileceği bir klinik hayaliyle kuruldu. Bugün dört uzman hekim ve tam donanımlı bir merkezle aynı hayali sürdürüyoruz.`}
      />

      <section className="container-x -mt-6 relative z-10">
        <StatsBand />
      </section>

      {/* Değerler */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Değerlerimiz"
          title="Nasıl çalıştığımızı belirleyen dört ilke"
          description="Kliniğimizin her kararı bu dört başlıktan geçer."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card p-6 text-center transition hover:-translate-y-1.5 hover:shadow-lift">
              <span className="text-4xl" aria-hidden>
                {v.emoji}
              </span>
              <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ekip */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="paw-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Ekibimiz"
            title="Dostunuza bakan eller"
            description="Hepimiz kendi patili dostlarımızla yaşıyoruz; bu yüzden endişenizi çok iyi anlıyoruz."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.name} className="card overflow-hidden p-0 text-center">
                <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${member.gradient}`}>
                  <PawIcon className="absolute -left-4 -top-4 h-20 w-20 text-white/40" />
                  <span className="relative text-6xl" aria-hidden>
                    {member.emoji}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold">{member.name}</h3>
                  <p className="mt-0.5 text-xs font-extrabold uppercase tracking-wide text-mint-600">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PawTrail />

      {/* Zaman çizelgesi */}
      <section className="section container-x">
        <SectionHeading eyebrow="Hikâyemiz" title="Küçük bir muayenehaneden bugüne" />
        <ol className="relative mx-auto mt-12 max-w-3xl border-l-2 border-dashed border-mint-200 pl-8">
          {timeline.map((item) => (
            <li key={item.year} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] grid h-8 w-8 place-items-center rounded-full bg-mint-500 text-white shadow-soft">
                <PawIcon className="h-4 w-4" />
              </span>
              <span className="inline-block rounded-full bg-cream-200 px-3 py-1 text-xs font-extrabold text-ink-600">
                {item.year}
              </span>
              <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Yorumlar */}
      <section className="container-x pb-16">
        <SectionHeading eyebrow="Referanslar" title="Pati sahiplerinin yorumları" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      <CtaBand
        title="Kliniğimizi görmeye ne dersiniz?"
        text="Randevu almadan önce bir tur atmak isterseniz kapımız açık. Uğrayın, tanışalım."
      />
      <div className="h-16" />
    </>
  );
}
