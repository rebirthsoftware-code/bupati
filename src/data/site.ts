/**
 * Sitenin tüm iletişim / kimlik bilgileri burada.
 * Kliniğin gerçek bilgilerini SADECE bu dosyadan güncellemek yeterli.
 */

export const site = {
  name: "BuPati Veteriner Kliniği",
  shortName: "BuPati",
  tagline: "Minik dostlarınız için sıcak bir yuva",
  description:
    "BuPati Veteriner Kliniği; muayene, aşı, cerrahi, laboratuvar ve pet kuaför hizmetleriyle kedi, köpek ve egzotik dostlarınızın yanında.",
  // WhatsApp numarası: ülke kodu ile, boşluksuz ve + işaretsiz yazın. (Örn: 905321234567)
  whatsapp: "905321234567",
  phoneDisplay: "0532 123 45 67",
  phoneHref: "+905321234567",
  email: "merhaba@bupati.com",
  address: "Bahçelievler Mah. Sevgi Sok. No: 12/A, Kadıköy / İstanbul",
  mapsUrl: "https://maps.google.com/?q=Kadıköy+İstanbul",
  emergencyNote: "Acil durumlar için 7/24 telefon hattımız açıktır.",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  hours: [
    { day: "Pazartesi - Cuma", value: "09:00 - 19:00" },
    { day: "Cumartesi", value: "09:00 - 17:00" },
    { day: "Pazar", value: "10:00 - 14:00" },
    { day: "Acil", value: "7/24 telefon desteği" },
  ],
  stats: [
    { value: "12+", label: "yıllık deneyim" },
    { value: "9.000+", label: "mutlu pati" },
    { value: "4", label: "uzman veteriner hekim" },
    { value: "7/24", label: "acil danışma" },
  ],
};

export const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

/** WhatsApp'a hazır mesajla yönlendiren link üretir. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
