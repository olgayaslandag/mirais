import { notFound } from "next/navigation";

/** Yerelleştirilmiş 404: eşleşmeyen tüm locale-altı yollar buraya düşer. */
export default function CatchAllNotFound() {
  notFound();
}
