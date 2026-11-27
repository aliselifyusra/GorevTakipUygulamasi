# Görev Takip Uygulaması

React ile geliştirilmiş günlük görev ve odaklanma sayacı uygulaması.

## Özellikler
- Görev ekleme, düzenleme ve silme
- Görevleri tamamlandı olarak işaretleme
- Görevleri `localStorage` içinde saklama
- Saat, dakika ve saniye ayarlı odaklanma sayacı
- Başlatma, duraklatma ve sıfırlama
- Süre bitince görsel uyarı ve sesli alarm
- Bebek mavisi, toz pembe ve pastel renkli arayüz

## Teknolojiler
React, JavaScript, CSS, localStorage.

## Kurulum
1. Proje klasörünü VS Code ile açın.
2. Terminalde `npm install` çalıştırın.
3. `package.json` içindeki `scripts` bölümünden geliştirme komutunu kontrol edin.
4. Vite kullanılıyorsa genellikle `npm run dev` ile başlatılır.
5. Terminalde verilen yerel adresi tarayıcıda açın.

## Veri saklama
Görevler tarayıcıdaki `localStorage` alanında `tasks` anahtarıyla saklanır. Tarayıcı verileri silinirse görevler de silinebilir.

## GitHub notu
`node_modules/`, `.env` ve gizli/kişisel veriler depoya yüklenmemelidir.
