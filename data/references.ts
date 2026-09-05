// Referans logoları: kayrametal.com/referanslar galerisinden indirildi (public/assets/img/logos)
// Yeni logo eklemek için dosyayı public/assets/img/logos altına koyup listeye adını eklemek yeterli.

export type ReferenceLogo = {
  src: string;
  alt: string;
};

const files = [
  ...Array.from({ length: 26 }, (_, i) => `${i + 1}.png`),
  "123123123.png",
];

export const referenceLogos: ReferenceLogo[] = files.map((file, i) => ({
  src: `/assets/img/logos/${file}`,
  alt: `Referans logosu ${i + 1}`,
}));
