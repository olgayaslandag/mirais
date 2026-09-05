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
  title: "Kayra Metal | Üretiyoruz. Güven inşa ediyoruz.",
  description:
    "Kayra Metal, yapı sektörüne güvenilir alüminyum çözümleri sunar.",
  // Site amblemi: kayrametal.com site ikonu yerelleştirildi
  icons: {
    icon: "/assets/img/kayra-amblem.png",
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
