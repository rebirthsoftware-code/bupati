"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./icons";
import { services } from "@/data/services";

/**
 * Form gönderilmez; girilen bilgiler düzenli bir WhatsApp mesajına dönüştürülür.
 * Böylece sunucuya veri kaydetmeden randevu talebi iletilebilir.
 */
export function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    petName: "",
    petType: "Kedi",
    service: services[0].title,
    date: "",
    note: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const message = [
    `Merhaba ${site.shortName}, randevu talebim var 🐾`,
    ``,
    `👤 Ad Soyad: ${form.name || "-"}`,
    `📞 Telefon: ${form.phone || "-"}`,
    `🐾 Dostumun adı: ${form.petName || "-"} (${form.petType})`,
    `🩺 Hizmet: ${form.service}`,
    `📅 Tercih ettiğim tarih: ${form.date || "Esnek"}`,
    form.note ? `📝 Not: ${form.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const ready = form.name.trim().length > 1 && form.phone.trim().length > 5;

  return (
    <form
      className="card p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      }}
    >
      <h2 className="font-display text-2xl font-bold">Randevu Talebi</h2>
      <p className="mt-1 text-sm text-ink-600">
        Formu doldurun, bilgiler hazır bir WhatsApp mesajına dönüşsün. Sitede veri saklamıyoruz.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-name">
            Ad Soyad *
          </label>
          <input id="ap-name" className="field" value={form.name} onChange={set("name")} required maxLength={60} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-phone">
            Telefon *
          </label>
          <input
            id="ap-phone"
            className="field"
            value={form.phone}
            onChange={set("phone")}
            placeholder="05xx xxx xx xx"
            required
            maxLength={20}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-pet">
            Dostunuzun adı
          </label>
          <input id="ap-pet" className="field" value={form.petName} onChange={set("petName")} maxLength={40} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-type">
            Türü
          </label>
          <select id="ap-type" className="field" value={form.petType} onChange={set("petType")}>
            {["Kedi", "Köpek", "Kuş", "Kemirgen", "Sürüngen", "Diğer"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-service">
            Hizmet
          </label>
          <select id="ap-service" className="field" value={form.service} onChange={set("service")}>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-date">
            Tercih ettiğiniz tarih
          </label>
          <input id="ap-date" type="date" className="field" value={form.date} onChange={set("date")} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-ink-600" htmlFor="ap-note">
            Şikâyet / not
          </label>
          <textarea
            id="ap-note"
            className="field min-h-[110px] resize-y"
            value={form.note}
            onChange={set("note")}
            maxLength={500}
            placeholder="Örn. iki gündür iştahsız, ara ara öksürüyor."
          />
        </div>
      </div>

      <button type="submit" className="btn-whatsapp mt-6 w-full" disabled={!ready}>
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp'tan Gönder
      </button>
      {!ready && (
        <p className="mt-2 text-center text-xs text-ink-400">Ad ve telefon alanlarını doldurun.</p>
      )}
    </form>
  );
}
