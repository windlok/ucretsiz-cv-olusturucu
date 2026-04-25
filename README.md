<img width="1480" height="919" alt="image" src="https://github.com/user-attachments/assets/23a8ef5f-4c46-4abe-9786-6660fc010166" />
# Ücretsiz CV Oluşturucu (Tek Dosya)

Canlı demo: https://windlok.github.io/ucretsiz-cv-olusturucu/

Tarayıcı içinde çalışan, tek dosyalık (build gerektirmeyen) CV oluşturucu. Sol panelden bilgilerini doldururken sağ tarafta A4 önizleme anlık güncellenir.

## Özellikler

- **A4 önizleme + yazdırma:** Tarayıcı yazdırma ekranından PDF al.
- **Tek tık PDF indirme:** `html2pdf.js` ile direkt PDF indir (kalite/dosya boyutu preset’leri var).
- **ATS modu:** Daha sade/tek kolon, metin odaklı çıktı.
- **Tema + font seçimi:** Renk teması ve font değiştirme.
- **Metin ölçeği:** Önizleme yazı boyutunu %80–%120 aralığında ayarla.
- **Profiller:** CV’yi farklı isimlerle kaydet/yükle/sil (tarayıcı `localStorage`).
- **İçe/dışa aktarma:** JSON yükle ve JSON indir.
- **Ek çıktılar:** ATS TXT, RTF (Word), DOCX (şablon) indirme.

## Nasıl Kullanılır?

### 1) Site üzerinden

Doğrudan demoyu aç:

- https://windlok.github.io/ucretsiz-cv-olusturucu/

### 2) Local çalıştırma

Bu proje **tek HTML** olduğu için istersen dosyayı çift tıklayıp açarak da kullanabilirsin. Yine de (özellikle bazı tarayıcı kısıtları için) küçük bir static server ile çalıştırmak daha sorunsuz olur.

**Seçenek A — Python (önerilir):**

```bash
python -m http.server 5173
```

Ardından:

- http://localhost:5173

**Seçenek B — Node:**

```bash
npx serve .
```

Not: Uygulama CDN üzerinden **Vue 3**, **Tailwind** ve **html2pdf.js** yüklediği için internet bağlantısı gerekir.

## Proje Yapısı

- `index.html` — Uygulamanın tamamı (UI + Vue state + export işlemleri)
- `_bootcheck.js` — CDN yükleme/fallback kontrolü (Vue/html2pdf yüklenmezse hata göstermeye yardımcı)

## Veri / Gizlilik

- Her şey tarayıcı içinde çalışır; bir sunucuya veri göndermez.
- “Profiller” özelliği CV verisini tarayıcının `localStorage` alanına kaydeder.

## GitHub Pages

Bu repo GitHub Pages’te kökten (`/`) yayınlanacak şekilde uygundur. Pages ayarında **Branch: main** ve **Folder: /(root)** seçili olmalı.

Canlı link:

- https://windlok.github.io/ucretsiz-cv-olusturucu/

## Katkı

PR/issue açabilirsin. Küçük değişikliklerde:

1) `index.html` içinde tek dosya düzenini bozma
2) Yeni bağımlılık ekleyeceksen CDN uyumunu düşün

## Lisans

Bu repoda henüz bir `LICENSE` dosyası yok. Lisans netleştirilecekse ayrıca eklenebilir.
