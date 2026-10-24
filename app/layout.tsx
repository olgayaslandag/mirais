import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Preloader from "@/components/Preloader";
import "./globals.css";

// Google font: orijinal HTML'deki Rubik + ağırlıklar birebir taşındı
const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mira İş Sağlığı ve Güvenliği Ekipmanları | İnovatif Metal Çözümleri",
  description:
    "Mira İş Sağlığı ve Güvenliği Ekipmanları, yapı ve endüstriyel projeler için yüksek kaliteli alüminyum sistemler ve özel metal işçiliği sunar.",
  metadataBase: new URL("https://mirais.com.tr"),
  // Site amblemi: mirais.com.tr site ikonu
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-270x270.png", sizes: "270x270", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Mira İş Sağlığı ve Güvenliği Ekipmanları | İnovatif Metal Çözümleri",
    description:
      "Mira İş Sağlığı ve Güvenliği Ekipmanları, yapı ve endüstriyel projeler için yüksek kaliteli alüminyum sistemler ve özel metal işçiliği sunar.",
    url: "https://mirais.com.tr",
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={rubik.className}>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
