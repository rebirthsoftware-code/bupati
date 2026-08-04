export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: IconName;
  points: string[];
  price?: string;
  featured?: boolean;
};

export type IconName =
  | "stethoscope"
  | "syringe"
  | "scalpel"
  | "microscope"
  | "xray"
  | "tooth"
  | "scissors"
  | "chip"
  | "heart"
  | "bird"
  | "ambulance"
  | "home";

export const services: Service[] = [
  {
    slug: "genel-muayene",
    title: "Genel Muayene & Check-Up",
    short: "Baştan aşağı detaylı sağlık kontrolü.",
    description:
      "Dostunuzun genel sağlık durumunu değerlendirdiğimiz, yaşına ve türüne göre planlanan kapsamlı muayene. Kalp, akciğer, deri, göz, kulak ve ağız kontrolü tek seansta.",
    icon: "stethoscope",
    points: ["Detaylı fizik muayene", "Yaşa özel check-up paketleri", "Beslenme ve kilo danışmanlığı"],
    price: "600 ₺'den başlayan",
    featured: true,
  },
  {
    slug: "asi-parazit",
    title: "Aşı & Parazit Koruma",
    short: "Karma, kuduz ve iç–dış parazit programı.",
    description:
      "Yavru ve erişkin dönem aşı takvimini biz takip ediyoruz. Aşı zamanı geldiğinde WhatsApp'tan hatırlatma gönderiyoruz, böylece hiçbir doz atlanmıyor.",
    icon: "syringe",
    points: ["Karma, kuduz, lösemi aşıları", "İç ve dış parazit uygulaması", "Otomatik aşı hatırlatma"],
    price: "450 ₺'den başlayan",
    featured: true,
  },
  {
    slug: "cerrahi",
    title: "Cerrahi Operasyonlar",
    short: "Kısırlaştırmadan ortopediye steril ameliyathane.",
    description:
      "Tam donanımlı ameliyathanemizde yumuşak doku, ortopedi ve kısırlaştırma operasyonları yapılıyor. Anestezi öncesi kan tahlili ve operasyon boyunca canlı monitörizasyon standardımız.",
    icon: "scalpel",
    points: ["Anestezi öncesi kan tahlili", "Canlı hasta monitörizasyonu", "Operasyon sonrası yatılı takip"],
    featured: true,
  },
  {
    slug: "laboratuvar",
    title: "Klinik Laboratuvar",
    short: "Sonuçlar 20 dakikada elinizde.",
    description:
      "Kan sayımı, biyokimya, hormon, idrar ve dışkı analizleri kendi laboratuvarımızda yapılıyor. Hızlı sonuç, hızlı tedavi demek.",
    icon: "microscope",
    points: ["Hemogram & biyokimya", "Hormon ve serolojik testler", "Sonuçlar 20 dk içinde"],
    featured: true,
  },
  {
    slug: "goruntuleme",
    title: "Dijital Röntgen & Ultrason",
    short: "Işınsız, hızlı ve net görüntüleme.",
    description:
      "Dijital röntgen ve ultrason cihazlarımızla kırık, iç organ ve gebelik takibini anında değerlendiriyoruz. Görüntüler dijital olarak arşivleniyor.",
    icon: "xray",
    points: ["Dijital röntgen", "Abdominal ultrason", "Gebelik ve kardiyoloji takibi"],
    featured: true,
  },
  {
    slug: "dis-sagligi",
    title: "Diş Sağlığı",
    short: "Ultrasonik diş taşı temizliği.",
    description:
      "Ağız kokusu ve diş eti hastalıkları küçük dostlarımızın en sık yaşadığı sorunlardan. Ultrasonik cihazla diş taşı temizliği ve gerekli durumlarda diş çekimi yapıyoruz.",
    icon: "tooth",
    points: ["Ultrasonik diş taşı temizliği", "Diş eti tedavisi", "Evde bakım eğitimi"],
    featured: true,
  },
  {
    slug: "pet-kuafor",
    title: "Pet Kuaför & Bakım",
    short: "Tüy bakımı, tıraş, tırnak ve kulak temizliği.",
    description:
      "Stres yaratmayan, sakin bir ortamda ırka özel tıraş, yıkama, tüy açma, tırnak kesimi ve kulak temizliği. Randevu ile çalışıyoruz, dostunuz sırada beklemiyor.",
    icon: "scissors",
    points: ["Irka özel tıraş modelleri", "Antiparaziter yıkama", "Tırnak & kulak bakımı"],
    price: "500 ₺'den başlayan",
  },
  {
    slug: "mikrocip-pasaport",
    title: "Mikroçip & Pet Pasaport",
    short: "Kayıp riskine karşı yasal kimlik.",
    description:
      "Mikroçip uygulaması, dijital kimlik kaydı ve yurt dışı seyahatler için pet pasaport işlemlerinizi eksiksiz tamamlıyoruz.",
    icon: "chip",
    points: ["Mikroçip uygulaması", "Resmî kimlik kaydı", "Yurt dışı seyahat evrakları"],
  },
  {
    slug: "dahiliye",
    title: "İç Hastalıkları",
    short: "Kronik hastalık takibi ve tedavi planı.",
    description:
      "Böbrek, karaciğer, diyabet gibi kronik rahatsızlıklarda uzun soluklu tedavi ve düzenli kontrol planı oluşturuyoruz.",
    icon: "heart",
    points: ["Kronik hastalık takibi", "Serum ve enjeksiyon uygulaması", "Reçeteli diyet planlaması"],
  },
  {
    slug: "egzotik",
    title: "Egzotik Hayvan Hekimliği",
    short: "Kuş, tavşan, hamster ve sürüngenler.",
    description:
      "Kanatlı, kemirgen ve sürüngen dostlar için özel muayene ve bakım. Küçük bedenler, özel bilgi ister; ekibimiz bu konuda deneyimli.",
    icon: "bird",
    points: ["Kuş ve kemirgen muayenesi", "Sürüngen bakım danışmanlığı", "Tırnak ve gaga bakımı"],
  },
  {
    slug: "acil",
    title: "Acil Servis",
    short: "Beklenmeyen anlar için hazırız.",
    description:
      "Zehirlenme, travma, doğum güçlüğü gibi acil durumlarda önce telefonla bize ulaşın; siz yola çıkarken biz hazırlığa başlarız.",
    icon: "ambulance",
    points: ["7/24 telefon triyajı", "Acil müdahale odası", "Yoğun bakım ünitesi"],
  },
  {
    slug: "evde-bakim",
    title: "Evde Sağlık Hizmeti",
    short: "Stresli dostlar için ayağınıza geliyoruz.",
    description:
      "Kliniğe gelmesi zor olan yaşlı veya çok stresli hastalar için aşı, kan alma ve kontrol muayenesini evinizde gerçekleştiriyoruz.",
    icon: "home",
    points: ["Evde aşı ve muayene", "Yaşlı hasta bakımı", "Randevu ile bölgesel hizmet"],
  },
];

export const featuredServices = services.filter((s) => s.featured);
