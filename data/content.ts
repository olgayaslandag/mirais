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
    overviewText: string;
    image: string;
    alt: string;
    href: string;
    slug?: string;
    metaDescription?: string;
    benefitsWithIcons: { title: string; body: string }[];
    processSteps: { title: string; body: string }[];
    benefitsParagraph: string;
    brands: { name: string; logo: string }[];
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
        { title: "Teknik Destek", body: "Teknik desteği yalnızca proses bazlı ürün seçimi konusunda sağlıyoruz." },
      ],
      faq: [
        { question: "Hangi ürünler sunuyorsunuz?", answer: "Martor, Justrite ve Röetzmeier markalarından iş sağlık ve güvenliği ekipmanları sunuyoruz." },
        { question: "Hangi markaların ürünlerini tedarik ediyorsunuz?", answer: "Martor, Justrite ve Röetzmeier markalarının iş sağlığı ve güvenliği ekipmanlarını tedarik ediyoruz. Ürün kataloğumuz kesiciden kimyasal depolamaya, yüksekte çalışmadan elektrik güvenliğine geniş bir yelpazeyi kapsıyor." },
        { question: "Teknik destek sağlıyor musunuz?", answer: "Evet, teknik desteği yalnızca proses bazlı ürün seçimi konusunda veriyoruz." },
        { question: "Siparişler ne kadar sürede teslim edilir?", answer: "Stoktaki ürünlerde teslimat kısa süre içinde planlanır; proje bazlı ve hacimli siparişlerde teslim takvimi ihtiyaçlarınıza göre netleştirilir. İstanbul ve İzmir şubelerimizle bölgesel hız sağlıyoruz." },
        { question: "Teklif almadan önce nelere dikkat etmeliyim?", answer: "İhtiyaç duyulan ekipmanın kullanım alanı ve ilgili riskler netleştirilmelidir. Sürecinizi paylaşmanız hâlinde uzman ekibimiz proses bazlı doğru ürün seçiminde yönlendirme yapar." },
      ],
    },
  };

  const en: SiteContent = {
    heroSlides: heroSlides.map((s, index) => ({
      ...s,
      eyebrow: index === 0
        ? "Mira Occupational Health and Safety Equipment Inc."
        : "Mira Occupational Health and Safety Equipment Inc.",
      title: index === 0
        ? ["With our brands", "quality service"]
        : ["Safety in construction", "reliable solutions"],
      lead: index === 0
        ? "We provide safety solutions with Martor, Justrite and Röetzmeier safety solutions for your workplace."
        : "Mira Occupational Health and Safety Equipment provides occupational health and safety equipment in construction and industrial sectors with Martor, Justrite and Röetzmeier brands.",
    })),
    services: services.map((s) => {
      const base = {
        ...s,
      };
      if (s.title === "ÜRÜN SATIŞI") {
        return {
          ...base,
          title: "PRODUCT SALES",
          description:
            "We partner with Martor, Justrite and Röetzmeier for OHS products and solutions.",
          overviewText:
            "Martor, Justrite and Röetzmeier safety solutions to increase workplace safety. Our catalog offers thousands of products from leading brands, covering personal protective equipment, fall protection systems, electrical safety devices, and chemical storage solutions. Carefully selecting the right equipment for specific workplace hazards and project requirements ensures full compliance with OHS regulations and creates a safer working environment. We recommend reviewing the detailed product catalog or sharing project-specific needs with our expert team to identify the most suitable safety solutions for your operation.",
          benefits: ["Quality guaranteed products", "Technical support available", "Capiente delivery service"],
          benefitsParagraph:
            "Martor, Justrite and Röetzmeier markalarının standartlarına uygun olarak kalite kontrol edilen ürünler ile Kalite garanti ürünler sunuyoruz. Teknik ekibimiz her adımda teknik destek ve danışmanlık sunarak projeleriniz güvenli bir şekilde yönetiliyor. Large ölçekli entrega hizmetleri ile projeleriniz zamanında tamamlanacak Kapasiteli entrega hizmeti.",
          benefitsWithIcons: [
            { title: "Quality guaranteed products", body: "Martor, Justrite ve Röetzmeier standartlarına uygun olarak kalite kontrol edilmiştir." },
            { title: "Technical support available", body: "Technical support and consultancy services throughout your project." },
            { title: "Capiente delivery service", body: "Your projects will be completed on time with large-scale delivery services." },
          ],
          processSteps: [
            { title: "Product Selection", body: "Determine the most suitable products for your needs." },
            { title: "Place Order", body: "Order the required equipment." },
            { title: "Delivery", body: "Your products will be delivered on time." },
          ],
          metaDescription:
            "Mira product sales service - Increase your safety with Martor, Justrite and Röetzmeier safety solutions. Thousands of products available in the catalog.",
        };
      }
      if (s.title === "TEKNİK DESTEK") {
        return {
          ...base,
          title: "TECHNICAL SUPPORT",
          description:
            "Technical support for product installation, maintenance and issue resolution.",
          overviewText:
            "Our expert team provides support for the installation, maintenance and resolution of technical issues with our products. Our professional technical staff provides full support during product installation, periodic maintenance till fault resolution processes. Correct setup and regular maintenance are critical to prevent premature breakdowns that may result from incorrect use. All operations are performed in accordance with TBB standards and product performance is continuously monitored through quality control processes. Since all catalog products are manufactured in accordance with Martor, Justrite and Röetzmeier standards, you can extend your equipment lifespan and improve occupational safety by implementing correct maintenance programs.",
          benefits: ["Extended product lifespan", "Premature breakdowns prevented", "Operational efficiency increased"],
          benefitsParagraph:
            "Ürün ömrünüzü Professional bakım ile uzatırız Premature breakdown'lar önlemek için hızlı müdahale ile teknik sorunlar çözülür. Operasyonel verimlilik artırılarak Optimized product performance ile iş süreçleriniz daha verimli olur. TBB standartlarına uygun destek ile uzman ekibimiz her adımda yanınızda.",
          benefitsWithIcons: [
            { title: "Extended product lifespan", body: "Professional bakım ile ürün ömrünüz uzar." },
            { title: "Premature breakdowns prevented", body: "Hızlı müdahale ile teknik sorunlar çözülür." },
            { title: "Operational efficiency increased", body: "Operasyonel verimlilik artırılmış iş süreçleriniz." },
          ],
          processSteps: [
            { title: "Professional Installation", body: "Professional installation by our expert team." },
            { title: "Periodic Maintenance", body: "Regular maintenance processes." },
            { title: "Fault Resolution", body: "Resolution of technical issues by technical staff." },
            { title: "Performance Monitoring", body: "Continuous monitoring of product performance." },
          ],
          metaDescription:
            "Mira technical support service - Product installation, maintenance and fault resolution with our expert team. TBB standard-compliant support and technical services.",
          };
        }
        return base;
    }),
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
        { title: "Technical Support", body: "We provide technical support only for process-based product selection." },
      ],
      faq: [
        { question: "What products do you offer?", answer: "We offer occupational health and safety equipment from Martor, Justrite and Röetzmeier brands." },
        { question: "Which brands do you supply?", answer: "We supply Martor, Justrite and Röetzmeier occupational health and safety equipment. Our catalog ranges from cutting tools to chemical storage, fall protection and electrical safety." },
        { question: "Do you provide technical support?", answer: "Yes, we provide technical support only for process-based product selection." },
        { question: "How long does delivery take?", answer: "In-stock products are delivered promptly; for project-based and bulk orders the schedule is planned around your needs. Our Istanbul and İzmir offices provide regional speed." },
        { question: "What should I consider before requesting a quote?", answer: "Clarify the application area and the relevant risks of the equipment you need. Once you share your process, our expert team guides you toward the right product selection." },
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
  overviewText: string;
  image: string;
  alt: string;
  benefits: string[];
  benefitsParagraph: string;
  href: string;
  slug?: string;
  metaDescription?: string;
  benefitsWithIcons: { title: string; body: string }[];
  processSteps: { title: string; body: string }[];
  brands: { name: string; logo: string }[];
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
      "Martor, Justrite ve Röetzmeier markalarıyla OHS ürün kataloğu ve product sales hizmeti.",
    overviewText:
      "Martor, Justrite ve Röetzmeier markalarının güvenlik çözümleriyle işyerinizdeki iş güvencesini artırın. Katalogumuzda binlerce product, personal protective equipment, fall protection systems, electrical safety devices ve chemical storage solutions içermektedir. İş ihtiyaçlarınız ve proje gerekliliklerine göre doğru ekipman seçerek OHS düzenlemelerine uyum sağlayabilir ve daha güvenli bir çalışma ortamı oluşturabilirsiniz. Detaylı katalog incelemesi ya da proje-specifik ihtiyaçlarınız ile ilgili danışmanlık için uzman ekibimizle iletişime geçebilirsiniz.",
    image: "/assets/img/services/toz-boya-1.jpg",
    alt: "Ürün satışı hizmeti",
    benefits: ["Kalite Garanti Ürünler", "Teknik Destek Mevcut", "Kapasiteli Entrega Hizmeti"],
    benefitsParagraph:
      "Martor, Justrite ve Röetzmeier markalarının standartlarına uygun olarak kalite kontrol edilen ürünler ile Kalite garanti ürünler sunuyoruz. Teknik ekibimiz her adımda teknik destek ve danışmanlık sunarak projeleriniz güvenli bir şekilde yönetiliyor. Large ölçekli entrega hizmetleri ile projeleriniz zamanında tamamlanacak Kapasiteli entra hizm.",
    href: "/hizmetler/urun-satisi",
    slug: "urun-satisi",
    metaDescription: "Mira ürün satış hizmeti - Martor, Justrite ve Röetzmeier markalarının güvenlik çözümleriyle çalışan güvenliğini artırın. Kataloğuzdan thousands of products available.",
    benefitsWithIcons: [
      { title: "Kalite Garanti Ürünler", body: "Martor, Justrite ve Röetzmeier standartlarına uygun olarak kalite kontrol edilmiştir." },
      { title: "Teknik Destek Mevcut", body: "Projeleriniz boyunca teknik destek ve danışmanlık hizmetleri." },
      { title: "Kapasiteli Entrega Hizmeti", body: "Projeleriniz zamanında tamamlanacak Large ölçekli entrega hizmeti." },
    ],
    processSteps: [
      { title: "Ürün Seçimi", body: "İş ihtiyaçlarınız için en uygun ürünleri belirleyin." },
      { title: "Sipariş Verme", body: "Gerekli ekipmanları sipariş verin." },
      { title: "Teslimat", body: "Ürünleriniz zamanlı teslim edilir." },
    ],
    brands: [
      { name: "Martor", logo: "/assets/img/brands/martor.png" },
      { name: "Justrite", logo: "/assets/img/brands/justrite.png" },
      { name: "Röetzmeier", logo: "/assets/img/brands/roetzmeier.png" },
    ],
  },
  {
    title: "TEKNİK DESTEK",
    description:
      "Ürün kurulumu ve teknik destek sadece proses bazlı ürün seçimi için sağlıyoruz.",
    overviewText:
      "Ürünlerinizin kurulumu, bakımı ve teknik sorunları için sadece proses bazlı ürün seçimi gerektiriyorsa, uzman ekibimiz sadece bu bağlamda destek olur. TBB standartlarına uygun süreç tespiti ve risk analizi ile ürün seçimi ve kurulum süreçleri optimize edilir. Teknik destek, seçilen prosesin uygunluğunu ve güvenliğini sağlamak üzere kullanılabilir.",
    image: "/assets/img/services/profil-ebatlama.jpg",
    alt: "Teknik destek hizmeti",
    benefits: ["Proses Uyumu", "Risk Azaltma", "Süreç Destekli Kurulum"],
    benefitsParagraph:
      "Ürün seçimi ve kurulum süreci, TBB standartlarına uygun şekilde planlanır ve uygulanır. Proses analizleriyle riskler azaltılır, operasyonel verimlilik artırılır. Teknik destek, seçilen prosesin güvenliğini ve verimliliğini sağlar.",
    href: "/hizmetler/teknik-destek",
    slug: "teknik-destek",
    metaDescription: "Mira teknik destek hizmeti - Sadece proses bazlı ürün seçimi için teknik destek sağlıyoruz.",
    benefitsWithIcons: [
      { title: "Proses Uyumu", body: "TBB standartlarına uygun süreç tespiti ve risk analizi." },
      { title: "Risk Azaltma", body: "Süreç analizleriyle potansiyel riskler önlenir." },
      { title: "Süreç Destekli Kurulum", body: "Teknik ekip, seçilen proses boyunca kurulum ve destek sağlar." },
    ],
    processSteps: [
      { title: "Process Selection", body: "İş ihtiyaçlarına uygun proses seçimi." },
      { title: "Order Placement", body: "Gerekli ekipman sipariş verilir." },
      { title: "Delivery & Setup", body: "Ürünler zamanında teslim ve kurulum." },
    ],
    brands: [
      { name: "Martor", logo: "/assets/img/brands/martor.png" },
      { name: "Justrite", logo: "/assets/img/brands/justrite.png" },
      { name: "Röetzmeier", logo: "/assets/img/brands/roetzmeier.png" },
    ],
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
