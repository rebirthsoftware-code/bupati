import Link from "next/link";
import type { ReactNode } from "react";
import { PawIcon, ServiceIcon, StarIcon, WhatsAppIcon } from "./icons";
import type { Service } from "@/data/services";
import { site, whatsappLink } from "@/data/site";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <div data-reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="eyebrow">
          <PawIcon className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-600">{description}</p>}
    </div>
  );
}

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <article
      id={service.slug}
      data-reveal
      className="group card scroll-mt-28 p-6 hover:-translate-y-1.5 hover:shadow-lift"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint-100 text-mint-600 transition duration-300 group-hover:scale-110 group-hover:bg-mint-500 group-hover:text-white">
          <ServiceIcon name={service.icon} className="h-7 w-7" />
        </span>
        {service.price && (
          <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-extrabold text-ink-600">
            {service.price}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.description}</p>
      <ul className="mt-4 space-y-2">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-ink-600">
            <PawIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-400" />
            {point}
          </li>
        ))}
      </ul>
      <a
        href={whatsappLink(`Merhaba, "${service.title}" hizmeti hakkında bilgi almak istiyorum.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-mint-600 transition hover:gap-3 hover:text-mint-700"
      >
        Bilgi al <span aria-hidden>→</span>
      </a>
    </article>
  );
}

export function StatsBand() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {site.stats.map((stat, i) => (
        <div key={stat.label} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="card p-5 text-center">
          <p className="font-display text-3xl font-extrabold text-mint-600 sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export function TestimonialCard({
  name,
  pet,
  text,
  rating,
}: {
  name: string;
  pet: string;
  text: string;
  rating: number;
}) {
  return (
    <figure data-reveal className="card flex h-full flex-col p-6">
      <div className="flex gap-1 text-coral-400">
        {Array.from({ length: rating }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">“{text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-cream-200 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-mint-600">
          <PawIcon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-bold text-ink-900">{name}</span>
          <span className="block text-xs text-ink-400">{pet}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function CtaBand({
  title = "Dostunuz için doğru adrestesiniz",
  text = "Randevu almak, ürün sipariş etmek veya sadece bir soru sormak için bize yazın. Genelde birkaç dakika içinde yanıtlıyoruz.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-5xl bg-mint-600 px-6 py-14 text-center text-white sm:px-12">
        <div className="paw-pattern absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em]">
            <PawIcon className="h-3.5 w-3.5" />
            Hemen ulaşın
          </span>
          <h2 className="mt-5 text-balance text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-mint-50/90">{text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink("Merhaba, randevu almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp'tan Randevu Al
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="btn w-full border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
            >
              ☎ {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint-100 via-cream-100 to-cream-50 pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="paw-pattern absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative text-center">
        <span className="eyebrow" data-reveal>
          <PawIcon className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
        <h1
          data-reveal
          style={{ transitionDelay: "90ms" }}
          className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          {title}
        </h1>
        <p
          data-reveal
          style={{ transitionDelay: "180ms" }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-600"
        >
          {description}
        </p>
        {children && (
          <div data-reveal style={{ transitionDelay: "270ms" }} className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function Breadcrumbish({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="container-x pt-6 text-xs font-semibold text-ink-400" aria-label="Sayfa yolu">
      {items.map((item, i) => (
        <span key={item.href}>
          {i > 0 && <span className="mx-2">/</span>}
          <Link href={item.href} className="hover:text-mint-600">
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
