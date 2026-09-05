// Site içeriği: kayrametal.com'dan birebir çekilen ürün/hizmet/proje verileri
// Görseller: public/assets/img altında yerelleştirildi (kaynak: kayrametal.com/wp-content/uploads)
// Yeni ürün/hizmet/proje eklemek için sadece bu dosyayı genişletmek yeterli.

export type Product = {
  title: string[];
  image: string;
  icon: string;
  alt: string;
  href: string;
  description: string;
};

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

export type Project = {
  title: string;
  image: string;
  alt: string;
  href: string;
};

// Hero slaytları: her slaytın kendi videosu ve metni var
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
    videoId: "CMRQUQnm4BE",
    eyebrow: "KAYRA METAL A.Ş.",
    title: ["Üretiyoruz. Güven", "inşa ediyoruz."],
    lead: "Yüksek kaliteli bağlantı elemanları ve metal çözümlerimizle sektörün güvenilir çözüm ortağı olmaya devam ediyoruz.",
  },
  {
    index: "02",
    videoId: "oxN8jv3oUow",
    eyebrow: "KAYRA METAL A.Ş.",
    title: ["Metali, güvene", "dönüştürüyoruz."],
    lead: "Alüminyum sistemler ve özel üretim çözümlerimizle yapı sektörünün ihtiyaçlarına değer katıyoruz.",
  },
];

// Slayt otomatik geçiş süresi (ms)
export const HERO_AUTOPLAY_MS = 12000;

// Ürün grupları (Çözümler): kayrametal.com ana sayfa + alt sayfalarından birebir
export const products: Product[] = [
  {
    title: ["ALÜMİNYUM", "PROFİLLER"],
    image: "/assets/img/products/banner-aluminyum.png",
    icon: "/assets/img/icons/aluminyum-profiller.svg",
    alt: "Alüminyum profiller - cephe sistemleri ve doğramalar",
    href: "#",
    description:
      "Cephe sistemlerinden doğramalara, katlanır kapılar ve sürme sistemlerden iç mekan bölmelere, çatı sistemlerinden çit ve küpeşte sistemlerine kadar yaşam alanlarınızda fark yaratıyoruz.",
  },
  {
    title: ["AKSESUARLAR"],
    image: "/assets/img/products/banner-aksesuar.jpg",
    icon: "/assets/img/icons/aksesuarlar.svg",
    alt: "Aksesuarlar - konfor, şıklık ve estetik",
    href: "#",
    description:
      "Aksesuar ürünlerimiz ile konfor, şıklık ve estetiği bir arada sunuyor, geniş seçeneklerimizle yaşam alanlarınıza değer katıyoruz.",
  },
  {
    title: ["KOMPOZİT", "PANELLER"],
    image: "/assets/img/products/banner-kompozit.jpg",
    icon: "/assets/img/icons/kompozit-paneller.svg",
    alt: "Kompozit paneller - estetik tasarım ve kullanım kolaylığı",
    href: "#",
    description:
      "Estetik tasarım imkanı sunan ve kullanım kolaylığına sahip kompozit panellerle kalite ve konforu bir arada sunuyoruz.",
  },
  {
    title: ["KUPESTE", "PROFİLLERİ"],
    image: "/assets/img/products/banner-kupeste.jpg",
    icon: "/assets/img/icons/kupeste-profilleri.svg",
    alt: "Küpeşte profilleri - cam ve alüminyum profil seçenekleri",
    href: "#",
    description:
      "Zemin üstü, zemin altı ve zemin kenarlarında cam ve alüminyum profil seçenekleri ile yaşam alanlarınızı daha güvenli hale getiriyoruz.",
  },
];

// Ürün alt kırılımları: her ürün grubunun detay sayfasındaki alt kategoriler
export const productSubGroups: ProductSubGroup[] = [
  {
    parentHref: "#",
    parentTitle: "ALÜMİNYUM PROFİLLER",
    title: "Standart Profiller",
    image: "/assets/img/products/standart-profil.jpg",
    alt: "Standart alüminyum profiller",
  },
  {
    parentHref: "#",
    parentTitle: "ALÜMİNYUM PROFİLLER",
    title: "Doğrama Profiller",
    image: "/assets/img/products/dograma-profil.jpg",
    alt: "Doğrama alüminyum profiller",
  },
  {
    parentHref: "#",
    parentTitle: "ALÜMİNYUM PROFİLLER",
    title: "Dekorasyon ve Tamamlayıcı Profiller",
    image: "/assets/img/products/dekorasyon-profil.jpg",
    alt: "Dekorasyon ve tamamlayıcı profiller",
  },
  {
    parentHref: "#",
    parentTitle: "AKSESUARLAR",
    title: "Projeye Özel",
    image: "/assets/img/products/projeye-ozel.jpg",
    alt: "Projeye özel aksesuarlar",
  },
  {
    parentHref: "#",
    parentTitle: "AKSESUARLAR",
    title: "Özel İmalat",
    image: "/assets/img/products/ozel-imalat.jpg",
    alt: "Özel imalat aksesuarlar",
  },
  {
    parentHref: "#",
    parentTitle: "AKSESUARLAR",
    title: "Donanım Grubu",
    image: "/assets/img/products/donanim-grubu.jpg",
    alt: "Donanım grubu aksesuarlar",
  },
  {
    parentHref: "#",
    parentTitle: "KOMPOZİT PANELLER",
    title: "3000 Serisi",
    image: "/assets/img/products/kompozit-renk.jpg",
    alt: "Kompozit panel 3000 serisi renk kataloğu",
  },
  {
    parentHref: "#",
    parentTitle: "KOMPOZİT PANELLER",
    title: "4000 Serisi",
    image: "/assets/img/products/kompozit-renk.jpg",
    alt: "Kompozit panel 4000 serisi renk kataloğu",
  },
  {
    parentHref: "#",
    parentTitle: "KOMPOZİT PANELLER",
    title: "5000 Serisi",
    image: "/assets/img/products/kompozit-renk.jpg",
    alt: "Kompozit panel 5000 serisi renk kataloğu",
  },
  {
    parentHref: "#",
    parentTitle: "KUPESTE PROFİLLERİ",
    title: "Alüminyum Kare ve Dikdörtgen",
    image: "/assets/img/products/kare-kupeste.jpg",
    alt: "Alüminyum kare ve dikdörtgen küpeşte",
  },
  {
    parentHref: "#",
    parentTitle: "KUPESTE PROFİLLERİ",
    title: "Alüminyum Yuvarlak Sistem",
    image: "/assets/img/products/yuvarlak-kupeste.jpg",
    alt: "Alüminyum yuvarlak küpeşte sistemi",
  },
  {
    parentHref: "#",
    parentTitle: "KUPESTE PROFİLLERİ",
    title: "Alüminyum Cam Kanal",
    image: "/assets/img/products/cam-kupeste.jpg",
    alt: "Alüminyum cam kanal küpeşte",
  },
];

// Hizmetler: kayrametal.com hizmet sayfalarından birebir metinler
export const services: Service[] = [
  {
    title: "YÜZEY İŞLEMLERİ",
    description:
      "Toz boya uygulamaları ile elde edilen yüzey kaplamalar; aşınmaya, korozyona, kimyasal etkilere ve darbelere karşı dayanıklıdır.",
    image: "/assets/img/services/toz-boya-1.jpg",
    alt: "Yüzey işlemleri - elektrostatik toz boya tesisi",
    href: "#",
  },
  {
    title: "MEKANİK İŞLEMLER",
    description:
      "Profil ve özel aksesuar kesim, delik açma, özel kesim alüminyum sac ve levhaların hazırlanması ve freze işlemlerinde en doğru çözümlerle kaliteli ve hızlı hizmet sunuyoruz.",
    image: "/assets/img/services/profil-ebatlama.jpg",
    alt: "Mekanik işlemler - profil ebatlama ve kesim",
    href: "#",
  },
  {
    title: "İZOMAT",
    description:
      "İzomat uygulamamızla farklı yüzey işlemi görmüş iç ve dış profillerin, projede tarif edilen formattaki gibi tedarik edilmesini sağlıyoruz.",
    image: "/assets/img/services/izomat-1.jpg",
    alt: "İzomat - yalıtımlı profil birleştirme",
    href: "#",
  },
  {
    title: "PROJE HİZMETLERİ",
    description:
      "Sistem profilleri, cephe kaplama sistemleri, kompozit panel, ofis bölme ve güneş kontrol sistemlerinde proje çiziminden montaj için supervisor hizmetine kadar uçtan uca çözüm ortağı oluyoruz.",
    image: "/assets/img/services/proje-hizmet-1.png",
    alt: "Proje hizmetleri - mimari tasarım ve imalat",
    href: "#",
  },
];

// Projeler: kayrametal.com ana sayfa + referanslar galerisindeki gerçek projeler
export const projects: Project[] = [
  {
    title: "Göktürk Konutları",
    image:
      "/assets/img/projects/Referanslar_0036_47_0001_Gokturk_KONUTLARI-3_WA55_KHR-2.jpg",
    alt: "Göktürk Konutları - WA55 pencere ve kapı sistemleri",
    href: "#",
  },
  {
    title: "Safiport Ticari Yapı",
    image: "/assets/img/projects/Referanslar_0036_47_0003_wa-55-safiport-ticari.jpg",
    alt: "Safiport ticari yapı - WA55 cephe sistemi",
    href: "#",
  },
  {
    title: "Akkuş Tekstil",
    image:
      "/assets/img/projects/Referanslar_0036_47_0011_Akkus-Tekstil_2013_WAT55-1.jpg",
    alt: "Akkuş Tekstil tesisi - WAT55 cephe uygulaması",
    href: "#",
  },
  {
    title: "Kemerburgaz Evleri",
    image:
      "/assets/img/projects/Referanslar_0036_47_0028_kemerburgaz-evleri-wat-55.jpg",
    alt: "Kemerburgaz Evleri - WAT55 doğrama sistemleri",
    href: "#",
  },
  {
    title: "Bahçeşehir Koleji Halkalı",
    image:
      "/assets/img/projects/Referanslar_0036_47_0032_BahcesehirKoleji_Halkali_wat55-4.jpg",
    alt: "Bahçeşehir Koleji Halkalı kampüsü - WAT55 sistemleri",
    href: "#",
  },
  {
    title: "KTAMS Projesi",
    image: "/assets/img/projects/Referanslar_0036_47_0006_KTAMS_WA55_SLA60.jpg",
    alt: "KTAMS projesi - WA55 ve SLA60 sistemleri",
    href: "#",
  },
  {
    title: "Kompozit Cephe Uygulaması",
    image:
      "/assets/img/projects/Referanslar_0036_47_0016_WAT55_KOMPOZIT-1-kopyasi.jpg",
    alt: "Kompozit cephe uygulaması - WAT55 kompozit panel",
    href: "#",
  },
  {
    title: "SLAT CWA Cephe Projesi",
    image:
      "/assets/img/projects/Referanslar_0036_47_0025_SLAT64_CWA50_WAT55-5.jpg",
    alt: "SLAT64 CWA50 WAT55 cephe projesi",
    href: "#",
  },
  {
    title: "WAT55 Referans Projesi",
    image: "/assets/img/projects/Referanslar_0036_47_0004_wa55.jpg",
    alt: "WAT55 referans projesi - pencere sistemi",
    href: "#",
  },
  {
    title: "GSA130 Cephe Sistemi",
    image: "/assets/img/projects/gsa130.jpg",
    alt: "GSA130 giydirme cephe sistemi uygulaması",
    href: "#",
  },
];

// Kurumsal istatistikler: kayrametal.com/hakkimizda sayfasından gerçek rakamlar
export const corporateFacts = [
  { value: "49", label: "Ülkeye ihracat kapasitesi" },
  { value: "8950", label: "Farklı müşteri ve tedarikçi" },
  { value: "23K+", label: "Ton ürün sevkiyatı" },
];

// Kurumsal tarihçe: kayrametal.com/hakkimizda kilometre taşları
export const corporateTimeline = [
  {
    year: "Haziran 2006",
    text: "4 kişilik ekip ile birlikte Çağlayan'da 200 m2 alanda kurulduk.",
  },
  {
    year: "2007",
    text: "Boyahanemizin açılışını gerçekleştirdik. Küçükyalı'da mağaza açılışımızı yaptık.",
  },
  {
    year: "2010",
    text: "Yenibosna'da 5.500 m2 yeni merkezimize taşındık. Amanos sistemleri için AR-GE çalışmalarına başladık, İzomat makinesi yatırımımızı yaptık.",
  },
  {
    year: "2012",
    text: "Amanos System markamızın tanıtımı için ilk fuar katılımını yaptık.",
  },
  {
    year: "2015",
    text: "Amanos GmbH şirketimizin açılışını gerçekleştirdik. Proje yönetimine başladık.",
  },
  {
    year: "2017",
    text: "BAU fuarına ilk katılımı sağladık.",
  },
  {
    year: "2022",
    text: "49 ülkeye ihracat yapabilme kapasitesine ulaştık.",
  },
  {
    year: "2023",
    text: "Lüleburgaz'da 11.000 m2'lik fabrika yatırımımızı yaptık.",
  },
];

export const corporateAccordion = [
  {
    title: "2006'dan bugüne kesintisiz büyüme",
    body: "2006 yılında küçük bir işletme ile kurulan Kayra Metal A.Ş., yüksek hacimli stok ve hızlı tedarik gücüyle bugün yüzlerce yeni projeye imza atıyor; yılda ortalama %24 büyüme kaydediyor. Çağlayan'daki 200 m2 atölyeden Lüleburgaz'daki 11.000 m2 fabrikaya uzanan bu yolculukta 49 ülkeye ihracat kapasitesine ulaştık.",
  },
  {
    title: "Kalite ve güven",
    body: "Değişime ve yeniliğe açıklığı sayesinde müşterilerinin farklı talepleri karşısında esnek ve çözüm odaklı bir yaklaşım sergiliyor; rekabetçi fiyat ve yüksek kalite anlayışıyla AR-GE çalışmalarını sürdürüyor. Elektrostatik toz boya, mekanik işlem ve izomat hatlarımızdaki uçtan uca kalite kontrol sayesinde her sevkiyatta aynı standardı koruyoruz.",
  },
  {
    title: "Amanos System markası",
    body: "Ar-Ge ve Ür-Ge çalışmalarının sonucunda 2012 yılında kendi markası Amanos System ile mimari sistemler alanında faaliyetlerine devam ediyor. Cephe, doğrama ve küpeşte sistemlerini kapsayan ürün ailesiyle yurt içi ve yurt dışındaki nitelikli projelere çözüm sunuyoruz.",
  },
];

// İletişim: kayrametal.com/iletisim sayfasından birebir
export const contactInfo = {
  headquarters:
    "Merkez: Akçaburgaz, 592. Sk No:14/1, PK34522 Esenyurt / İstanbul",
  factory:
    "Fabrika: Sarıcaali Küme Evler No: 311/1, 39750 Lüleburgaz / Kırklareli",
  mersis: "Mersis No: 0540039627600001",
  email: "kayra@kayrametal.com",
  phone: "0(212) 452 00 50",
  phoneHref: "tel:+902124520050",
  mapsUrl: "#",
};

export const navLinks = [
  { label: "KURUMSAL", href: "#corporate" },
  { label: "ÜRÜNLER", href: "#solutions" },
  { label: "ÇÖZÜMLER", href: "#solutions" },
  { label: "HİZMETLER", href: "#services" },
  { label: "PROJELER", href: "#projects" },
  { label: "İLETİŞİM", href: "#contact" },
];
