# Proje Bağlamı ve Kurallar

## Proje Bilgileri
- Framework: Laravel
- PHP Version: 8.2
- Architecture: Repository Service Pattern
- Database: MySQL
- Test Framework: Pest

## Dil Ayarları
- Response: Türkçe
- Code: İngilizce
- Comments: Türkçe

## Sistem Ayarları
- Auto-load: Aktif
- Refine after write: Aktif
- Breaking change öncesi onay: Gerekli
- Max context files: 10
- Cache: Aktif

## Zorunlu Kurallar
1. Controller içinde business logic YASAK
2. Controller → Repository doğrudan çağrı YASAK
3. PollModel, PollService, PollRepository suffix KULLAN
4. Interface üzerinden Repository çağrısı YAP
5. Blade dosyalarında {{ }} dışına asla ham veri yazma (XSS)
6. Frontend ajanı Backend yapısına (Route/Variable) BAĞIMLI çalışır
