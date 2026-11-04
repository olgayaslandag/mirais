// Site içeriği: mirais.com.tr'den toplanan ve normalize edilmiş veriler.
// Kaynak: mirais.com.tr (ana sayfa, /en/corporate/, /en/products/, /en/contact/)
// Markalar: Martor, Justrite, Röetzmeier.
// Görseller: public/assets/img altında yerelleştirilmektedir.

import { Locale } from "@/lib/i18n/routing";
import type { Product } from "@/lib/catalog";

export type SiteContent = {
  heroSlides: {
    index: string;
    videoId: string;
    eyebrow: string;
    title: string[];
    lead: string;
  }[];
  corporate: {
    title: string;
    founded: string;
    intro: string[];
    facts: { value: string; label: string }[];
    accordion: { title: string; body: string }[];
    timeline: { year: string; text: string }[];
    quality: { title: string; body: string };
    sustainability: { title: string; body: string };
  };
  services: {
    title: string;
    description: string;
    image: string;
    alt: string;
    href: string;
  }[];
  servicesPage: {
    steps: { title: string; body: string }[];
    faq: { question: string; answer: string }[];
  };
  offices: {
    city: string;
    address: string;
    phone: string;
    fax: string;
    email: string;
    mapsUrl: string;
  }[];
  catalogCta: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    fileNote: string;
    href: string;
  };
  contactEmail: string;
  whatsappUrl: string;
  whatsappLabel: string;
};

export function getSiteContent(locale: Locale): SiteContent {
  const tr: SiteContent = {
    heroSlides,
    services,
    corporate: {
      title: "Mira İş Sağlığı ve Güvenliği Ekipmanları",
      founded: "2003",
      intro: [
      "Mira İş Sağlığı ve Güvenliği Ekipmanları olarak, iş güvenliğinde Martor, Justrite ve Röetzmeier markalarıyla Türkiye'nin ve bölgenin lider iş sağlığı ve güvenlik ekipmanları distribütörüyuzz. İş güvencesi için koruyucu çözümler sunuyor, işletmelerin risklerini en aza indiriyoruz.",
      "Müşteri odaklı yaklaşım, endüstriyel tesislerin risklerini en aza indiren yüksek kaliteli koruyucu çözümler ve tedarik zincirindeki mükemmeliyetçilik.",
      "İstanbul ve İzmir şubeleri, uzman teknik kadro, sürekli gelişen ürün portföyü ve geleceğe güvenle bakan kurumsal vizyon."
    ],
      facts: corporateFacts.map((f) => ({ value: f.value, label: f.label })),
      accordion: corporateAccordion.map((a) => ({ title: a.title, body: a.body })),
      timeline: corporateTimeline.map((t) => ({ year: t.year, text: t.text })),
      quality: { title: "Kalite Politikası", body:
        "Mira İş Sağlığı ve Güvenliği Ekipmanları olarak, uluslararası standartlara tam uyum sağlayarak iş sağlığı ve güvenliği ekipmanları tedariinde en yüksek kalite seviyesini garanti ediyoruz. Müşteri memnuniyetini ve güvenliğini operasyonlarımızın merkezine yerleştiriyor; tedarik zincirimizin her aşamasında kalite kontrol süreçlerimizi titizlikle uygulayarak sektördeki güvenilirliğimizi sürekli artırıyoruz."
      },
      sustainability: { title: "Sürdürülebilirlik",
        body: "Çevresel sorumluluk bilinciyle hareket ederek, tüm iş süreçlerimizde sürdürülebilir ve çevre dostu uygulamaları benimsiyoruz. Karbon ayak izimizi azaltmak, enerji verimliliğini artırmak ve gelecek nesillere daha yaşanabilir, temiz bir dünya bırakmak için yenilenebilir kaynakları destekliyor ve ekosistemi koruyan operasyonel politikalar izliyoruz."
      },
    },
    offices: [
      {
        city: "İstanbul",
        address: "Yenişehir Mah. Sümbül Sk. Atlantis Premium İş. Mrk. A Bl. D:18 Pendik/İSTANBUL",
        phone: "+90 (216) 684 05 75",
        fax: "+90 (216) 684 05 74",
        email: "bilgi@mirais.com.tr",
        mapsUrl:
          "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9F%C4%B1%C4%9F%C4%B1/@40.9265647,29.3112429,17z/data=!4m6!3m5!1s0x14cadb66dd41c317:0xcfa0cca3ec7c4b62!8m2!3d40.9265647!4d29.3138178!16s%2Fg%2F1hc1dg829?entry=ttu",
      },
      {
        city: "İzmir",
        address: "1203/12 Sk. No:2/F Merkez Çarşı Yenişehir-İzmir",
        phone: "+90 (232) 458 66 16",
        fax: "+90 (232) 458 66 17",
        email: "bilgi@mirais.com.tr",
        mapsUrl:
          "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9Fl%C4%B1%C4%9G%C4%B1+Makina+ve+Enerji/@38.4248724,27.1202176,13z/data=!4m10!1m2!2m1!1smira+i%C5%9F+izmir!3m6!1s0x14bbd98d2b0e8ab1:0x7da30c12250ed93d!8m2!3d38.427979!4d27.1722303!15sCg5taXJhIGnFnyBpem1pcpIBHm9jY3VwYXRpb25hbF9zYWZldHlfYW5kX2hlYWx0aOABAA!16s%2Fg%2F11jxs3fbbf?entry=ttu",
      },
    ],
    catalogCta,
    contactEmail: "bilgi@mirais.com.tr",
    whatsappUrl: "https://wa.link/fwl04l",
    whatsappLabel: "WhatsApp Hattı",
    servicesPage: {
      steps: [
        { title: "Ürün Satışı", body: "Martor, Justrite ve Röetzmeier markalarından en iyi iş sağlık ve güvenliği ürünleri sunuyoruz." },
        { title: "Teknik Destek", body: "Ekibimizle ürün kurulumu, bakımı ve teknik sorunların çözümünde destek oluyoruz." },
        { title: "Risk Analizi", body: "Çalışanızda gerçekleştirdiğimiz risk analiziyle iş güvenliğinizi artırıyoruz." },
        { title: "Eğitim ve Danışmanlık", body: "İş sağlığı ve güvenliği konusunda eğitim programları ve danışmanlık hizmetleri sunuyoruz." },
      ],
      faq: [
        { question: "Hangı ürünler sunuyorsunuz?", answer: "Martor, Justrite ve Röetzmeier markalarından iş sağlık ve güvenliği ekipmanları sunuyoruz." },
        { question: "Teknik destek sağlıyor musunuz?", answer: "Evet, ekibimiz ürün kurulumu, bakımı ve teknik sorunların çözümünde destek olur." },
        { question: "Risk nasıl analiz ediyorsunuz?", answer: "Çalışanızda risk analizi yaparak iş güvenliğinizi artırırız." },
        { question: "Hangı eğitimler sunuyorsunuz?", answer: "İş sağlığı ve güvenliği eğitim programları ve danışmanlık hizmetleri sunuyoruz." },
      ],
    },
  };

  const en: SiteContent = {
    heroSlides: heroSlides.map((s) => ({
      ...s,
      eyebrow: s.eyebrow.replace("Mira", "Mira"),
    })),
    services: services.map((s) => ({
      ...s,
      title: s.title.replace("ÜRÜN SATIŞI", "PRODUCT SALES"),
    })),
    corporate: {
      title:
        "Safety is our commitment, your workplace is our priority.",
      founded: "2003",
      intro: [
      "As Mira Occupational Health and Safety Equipment, we are the leading distributor of occupational health and safety equipment in Türkiye and the region, working with Martor, Justrite and Röetzmeier.",
      "We always take care to offer products that solve the problem at its source, providing the most up-to-date security standards.",
      "Our Istanbul and İzmir offices, expert technical team, continuously growing product portfolio, and vision looking forward with confidence to the future."
    ],
      facts: [
        { value: "20+", label: "Years experience" },
        { value: "60+", label: "Product varieties" },
        { value: "500+", label: "Customers" },
      ],
      accordion: [
        {
          title: "Our Mission",
          body:
            "As Mira Occupational Health and Safety Equipment, we provide the most up-to-date security standards with Martor, Justrite and Röetzmeier solutions.",
        },
        {
          title: "Our Vision",
          body:
            "To be the reliable and innovative security equipment distributor of Türkiye and the region.",
        },
        {
          title: "Our Brands",
          body:
            "We provide the most up-to-date and innovative solutions with Martor, Justrite and Röetzmeier brands in occupational safety equipment.",
        },
      ],
      timeline: [
        { year: "2003", text: "Founded as distributor of Martor, Justrite and Röetzmeier in Türkiye." },
        { year: "2022", text: "Strengthened our brand identity and product portfolio with A.Ş. status." },
        { year: "2023", text: "Actively operating via miras.com.tr and digital channels with our distributor portfolio." },
      ],
      quality: {
        title: "Quality Policy",
        body:
          "As Mira Occupational Health and Safety Equipment, we guarantee the highest level of quality in the supply of occupational health and safety equipment by ensuring full compliance with international standards. We place customer satisfaction and safety at the center of our operations; we continuously increase our reliability in the sector by meticulously implementing our quality control processes at every stage of our supply chain.",
      },
      sustainability: {
        title: "Sustainability",
        body:
          "Acting with a sense of environmental responsibility, we adopt sustainable and eco-friendly practices across all our business processes. To reduce our carbon footprint, increase energy efficiency, and leave a more livable, clean world for future generations, we support renewable resources and pursue operational policies that protect the ecosystem.",
      },
    },
    offices: [
      {
        city: "Istanbul",
        address:
          "Yenişehir Mah. Sümbül Sk. Atlantis Premium İş. Mrk. A Bl. D:18 Pendik/ISTANBUL",
        phone: "+90 (216) 684 05 75",
        fax: "+90 (216) 684 05 74",
        email: "bilgi@mirais.com.tr",
        mapsUrl:
          "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9F%C4%B1%C4%9G%C4%B1/@40.9265647,29.3112429,17z/data=!4m6!3m5!1s0x14cadb66dd41c317:0xcfa0cca3ec7c4b62!8m2!3d40.9265647!4d29.3138178!16s%2Fg%2F1hc1dg829?entry=ttu",
      },
      {
        city: "Izmir",
        address: "1203/12 Sk. No:2/F Merkez Çarşı Yenişehir-İzmir",
        phone: "+90 (232) 458 66 16",
        fax: "+90 (232) 458 66 17",
        email: "bilgi@mirais.com.tr",
        mapsUrl:
          "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9Fl%C4%B1%C4%9G%C4%B1+Makina+ve+Enerji/@38.4248724,27.1202176,13z/data=!4m10!1m2!2m1!1smira+i%C5%9F+izmir!3m6!1s0x14bbd98d2b0e8ab1:0x7da30c12250ed93d!8m2!3d38.427979!4d27.1722303!15sCg5taXJhIGnFnyBpem1pcpIBHm9jY3VwYXRpb25hbF9zYWZldHlfYW5kX2hlYWx0aOABAA!16s%2Fg%2F11jxs3fbbf?entry=ttu",
      },
    ],
    catalogCta: {
      eyebrow: "E-CATALOG",
      title: "Review all our products and services in a single PDF.",
      description:
        "Access the latest catalog from Martor, Justrite and Röetzmeier safety equipment with a single click.",
      buttonLabel: "Download Catalog",
      fileNote: "PDF · ~4 MB",
      href: "/assets/catalog/mira-katalog.pdf",
    },
    contactEmail: "bilgi@mirais.com.tr",
    whatsappUrl: "https://wa.link/fwl04l",
    whatsappLabel: "WhatsApp Line",
    servicesPage: {
      steps: [
        { title: "Product Sales", body: "We offer the best occupational health and safety products from Martor, Justrite and Röetzmeier brands." },
        { title: "Technical Support", body: "Our expert team provides installation, maintenance, and technical issue resolution for our products." },
        { title: "Risk Analysis", body: "We conduct risk analyses at your workplace to improve occupational safety." },
        { title: "Training and Consultancy", body: "We provide occupational health and safety training programs and consultancy services." },
      ],
      faq: [
        { question: "What products do you offer?", answer: "We offer occupational health and safety equipment from Martor, Justrite and Röetzmeier brands." },
        { question: "Do you provide technical support?", answer: "Yes, our expert team provides installation, maintenance, and technical issue resolution services." },
        { question: "How do you conduct risk analysis?", answer: "We conduct risk analyses at your workplace to identify hazards and improve occupational safety." },
        { question: "What training programs do you offer?", answer: "We provide occupational health and safety training programs and consultancy services." },
      ],
    },
  };

  if (locale === "tr") return tr;
  return en;
}

// Keep exporting existing types and constants for backward compatibility

export type ProductSubGroup = {
  parentHref: string;
  parentTitle: string;
  title: string;
  image: string;
  alt: string;
};

export type Service = {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
};

// Hero slaytları: mirais.com.tr ana sayfa slider metinleri
export type HeroSlide = {
  index: string;
  videoId: string;
  eyebrow: string;
  title: string[];
  lead: string;
};

export const heroSlides: HeroSlide[] = [
  {
    index: "01",
    videoId: "gOwsZVEoWgo",
    eyebrow: "Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş.",
    title: ["Markalarımızla", "kaliteli hizmet"],
    lead: "Martor, Justrite ve Röetzmeier markalarının sunduğu güvenlik çözümleriyle iş yerlerinizde güvenliği sağlıyoruz.",
  },
  {
    index: "02",
    videoId: "n-EX1YNZYJk",
    eyebrow: "Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş.",
    title: ["İş güvenliğinde", "güvenilir çözüm"],
    lead: "Mira İş Sağlığı ve Güvenliği Ekipmanları, yapı ve endüstriyel sektörler için iş sağlığı ve güvenlik ekipmanlarında Martor, Justrite ve Röetzmeier markalarıyla hizmet verir.",
  },
];

// Slayt otomatik geçiş süresi (ms)
export const HERO_AUTOPLAY_MS = 12000;

// Ürün grupları (Çözümler): mirais.com.tr Ürünler mega menüsündeki kategoriler
export type ProductGroup = {
  title: string[];
  image: string;
  alt: string;
  href: string;
  description: string;
};

export const products: ProductGroup[] = [
  {
    title: ["Emniyetli Bıçaklar"],
    image: "/assets/img/products/emniyetli-bicaklar.jpg",
    alt: "Emniyetli bıçaklar kategorisi",
    href: "#katalog",
    description:
      "Martor emniyetli bıçak ve kesicilerle el güvenliğini üst düzeye çıkarın.",
  },
  {
    title: ["Emniyetli Kaplar"],
    image: "/assets/img/products/emniyetli-kaplar.jpg",
    alt: "Emniyetli kaplar kategorisi",
    href: "#katalog",
    description:
      "Justrite emniyetli kap ve konteynerlerle yanıcı sıvıları güvenle depolayın.",
  },
  {
    title: ["Hazneli Platformlar"],
    image: "/assets/img/products/hazneli-platformlar.jpg",
    alt: "Hazneli platformlar kategorisi",
    href: "#katalog",
    description:
      "Sızdırmaz hazneli platformlarla döküntü ve sızıntı riskini kontrol altında tutun.",
  },
  {
    title: ["Güvenli Dolaplar"],
    image: "/assets/img/products/guvenli-dolaplar.jpg",
    alt: "Güvenli dolaplar kategorisi",
    href: "#katalog",
    description:
      "Yangın ve kimyasal güvenlik dolaplarıyla riskli maddeleri standartlara uygun saklayın.",
  },
  {
    title: ["Varil Emniyet Ürünleri"],
    image: "/assets/img/products/varil-emniyet-urunleri.jpg",
    alt: "Varil emniyet ürünleri kategorisi",
    href: "#katalog",
    description:
      "Varil taşıma, dolum ve sızıntı kontrol ürünleriyle tesisi güvence altına alın.",
  },
  {
    title: ["Endüstriyel Küllükler"],
    image: "/assets/img/products/endustriyel-kullukler.jpg",
    alt: "Endüstriyel küllükler kategorisi",
    href: "#katalog",
    description:
      "Yangın güvenliğine uygun endüstriyel küllüklerle açık alan risklerini azaltın.",
  },
  {
    title: ["Paslanmaz Çelik Kaplar"],
    image: "/assets/img/products/paslanmaz-celik-kaplar.jpg",
    alt: "Paslanmaz çelik kaplar kategorisi",
    href: "#katalog",
    description:
      "Paslanmaz çelik kaplarla gıda ve kimya uygulamalarında hijyenik depolama sağlayın.",
  },
  {
    title: ["Seramik Uçlu Kesiciler"],
    image: "/assets/img/products/seramik-uclu-kesiciler.jpg",
    alt: "Seramik uçlu kesiciler kategorisi",
    href: "#katalog",
    description:
      "Seramik uçlu kesicilerle kıvılcımsız ve metal taramasız kesim yapın.",
  },
];

// Ürün alt kırılımları: mirais.com.tr /en/products/ sayfasındaki kategoriler
export const productSubGroups: ProductSubGroup[] = [
  {
    parentHref: "/en/urun-kategori/safety-knifes/",
    parentTitle: "SAFETY KNIFES",
    title: "Safety Knifes",
     image: "/assets/img/products/ozel-imalat.jpg",
    alt: "Güvenlik bıçakları çeşitleri",
  },
  {
    parentHref: "/en/urun-kategori/safety-containers/",
    parentTitle: "SAFETY CONTAINERS",
    title: "Safety Containers",
     image: "/assets/img/products/kare-kupeste.jpg",
    alt: "Güvenlik konteynerları ve kabınları",
  },
  {
    parentHref: "/en/urun-kategori/platforms/",
    parentTitle: "PLATFORMS",
    title: "Platforms",
     image: "/assets/img/products/standart-profil.jpg",
    alt: "İş platformları ve yerler",
  },
  {
    parentHref: "/en/urun-kategori/safety-cabinets/",
    parentTitle: "SAFETY CABINETS",
    title: "Safety Cabinets",
     image: "/assets/img/products/cam-kupeste.jpg",
    alt: "Güvenlik kapıları ve alçak gözetleme kabınları",
  },
  {
    parentHref: "/en/urun-kategori/industrial-ashtrays/",
    parentTitle: "İNDÜSTRİAL ASHTRAYS",
    title: "Industrial Ashtrays",
     image: "/assets/img/products/dekorasyon-profil.jpg",
    alt: "Endüstriyel tütün tünelleri",
  },
];

// Hizmetler: mirais.com.tr hizmetler bölümü metinleri
export const services: Service[] = [
  {
    title: "ÜRÜN SATIŞI",
    description:
      "İş sağlığı ve güvenlik ekipmanlarında Martor, Justrite ve Röetzmeier markalarıyla iş birliği yaparak en iyi ürünleri sunuyoruz.",
    image: "/assets/img/services/toz-boya-1.jpg",
    alt: "Ürün satışı hizmeti",
    href: "#",
  },
  {
    title: "TEKNİK DESTEK",
    description:
      "Ürünlerimizin kurulumu, bakımı ve teknik sorunlarının çözümünde uzman ekibimizle destek oluyoruz.",
    image: "/assets/img/services/profil-ebatlama.jpg",
    alt: "Teknik destek hizmeti",
    href: "#",
  },
  {
    title: "RİSK ANALİZİ",
    description:
      "İş yerlerinizde gerçekleştirdiğimiz risk analizleriyle iş güvenliğinizi artırıyoruz.",
    image: "/assets/img/services/izomat-1.jpg",
    alt: "Risk analizi hizmeti",
    href: "#",
  },
  {
    title: "EĞİTİM VE DANIŞMANLIK",
    description:
      "İş sağlığı ve güvenlik konusunda eğitim programları ve danışmanlık hizmetleri sunuyoruz.",
    image: "/assets/img/services/proje-hizmet-1.png",
    alt: "Eğitim ve danışmanlık hizmeti",
    href: "#",
  },
];

// Kurumsal istatistikler: kuruluş 2003 (canlı site), ürün sayısı canlı sitemap alt sınırı (69). Müşteri sayısı işletme kayıtları beyanı (Ekim 2026, kullanıcı onayı), logolar (27) yalnızca yayınlanmış alt küme
export const corporateFacts = [
  { value: "20+", label: "Yıl deneyim" },
  { value: "60+", label: "Ürün çeşidi" },
  { value: "500+", label: "Müşteri" },
];

// Kurumsal tarihçe: mirais.com.tr/hakkimizda kilometre taşları
export const corporateTimeline = [
  {
    year: "2003",
    text: "İş sağlığı ve iş güvenliği alanında Martor, Justrite ve Röetzmeier markalarının Türkiye distribütörlüğüyle Mira İş Sağlığı ve Güvenliği Ekipmanları olarak kuruldu.",
  },
  {
    year: "2022",
    text: "Mira İş Sağlığı ve Güvenliği Ekipmanları A.Ş. statüsüyle marka kimliğimizi ve ürün yelpazesini güçlendirdik.",
  },
  {
    year: "2023",
    text: "mirais.com.tr ve dijital kanallarımızda iş sağlığı ve güvenlik ekipmanları distribütörlüğümüzle aktif bulunmaktayız.",
  },
];

export const corporateAccordion = [
  {
    title: "Misyonumuz",
    body: "Mira İş Sağlığı ve Güvenliği Ekipmanları olarak işçi sağlığını korumada Martor, Justrite ve Röetzmeier çözümleriyle en güncel güvenlik standartlarını sunmaktır.",
  },
  {
    title: "Vizyonumuz",
    body: "İş sağlığı ve güvenliği alanında Türkiye'nin ve bölgenin güvenilir ve inovatif güvenlik ekipmanları distribütörü olmaktır.",
  },
  {
    title: "Markalarımız",
    body: "Martor, Justrite ve Röetzmeier markalarıyla iş güvenliği ekipmanlarında en güncel ve yenilikçi çözümler sunuyoruz.",
  },
];

// İletişim: mirais.com.tr/iletisim sayfasından birebir
export const contactInfo = {
  // Istanbul office
  istanbulAddress: "Yenişehir Mah. Sümbül Sk. Atlantis Premium İş. Mrk. A Bl. D:18 Pendik/İSTANBUL",
  istanbulPhone: "+90 (216) 684 05 75",
  istanbulFax: "+90 (216) 684 05 74",
  istanbulMapsUrl: "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1/@40.9265647,29.3112429,17z/data=!4m6!3m5!1s0x14cadb66dd41c317:0xcfa0cca3ec7c4b62!8m2!3d40.9265647!4d29.3138178!16s%2Fg%2F1hc1dg829?entry=ttu",
  // Izmir office
  izmirAddress: "1203/12 Sk. No:2/F Merkez Çarşı Yenişehir-İzmir",
  izmirPhone: "+90 (232) 458 66 16",
  izmirFax: "+90 (232) 458 66 17",
  izmirMapsUrl: "https://www.google.com/maps/place/Mira+%C4%B0%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Makina+ve+Enerji/@38.4248724,27.1202176,13z/data=!4m10!1m2!2m1!1smira+i%C5%9F+izmir!3m6!1s0x14bbd98d2b0e8ab1:0x7da30c12250ed93d!8m2!3d38.427979!4d27.1722303!15sCg5taXJhIGnFnyBpem1pcpIBHm9jY3VwYXRpb25hbF9zYWZldHlfYW5kX2hlYWx0aOABAA!16s%2Fg%2F11jxs3fbbf?entry=ttu",
  email: "bilgi@mirais.com.tr",
  phoneHref: "tel:+902166840575",
};

// Markalar
export const brands = [
  { name: "Martor", logo: "/assets/img/brands/martor.png" },
  { name: "Justrite", logo: "/assets/img/brands/justrite.png" },
  { name: "Röetzmeier", logo: "/assets/img/brands/roetzmeier.png" },
];

// Katalog indirme bandı (Hero sonrası)
export const catalogCta = {
  eyebrow: "E-KATALOG",
  title: "Tüm ürün ve hizmetlerimizi tek PDF'te inceleyin.",
  description:
    "Martor, Justrite ve Röetzmeier markalı iş sağlığı ve güvenliği ekipmanlarının güncel kataloğuna tek tıkla ulaşın.",
  buttonLabel: "Kataloğu İndir",
  fileNote: "PDF · ~4 MB",
  href: "/assets/catalog/mira-katalog.pdf",
};

export const navLinks = [
  { label: "KURUMSAL", href: "#corporate" },
  { label: "MARKALAR", href: "#brands" },
  { label: "ÜRÜNLER", href: "#solutions" },
  { label: "HİZMETLER", href: "#services" },
  { label: "İLETİŞİM", href: "#contact" },
];
