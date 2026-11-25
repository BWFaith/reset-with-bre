# Reset with Bre — Website

Open `index.html` in a browser (or upload the whole folder to any host: Netlify, Vercel, cPanel).

## Pages
index, about, services, signature, post-surgical-mld, deep-tissue-massage, prenatal-massage, gallery, booking, faq, contact (11 pages)

## Edit in ONE place: `js/config.js`
Phone, email, Instagram/TikTok links, service prices, add-ons, travel fees, time slots.

## Make booking emails work (client copy + owner copy)
1. Create a free account at emailjs.com, add an email service and a template.
2. Template "To email" field: `{{to_email}}`. Useful variables: name, service, duration, addons, area, travel, total, date, time, address, phone, notes.
3. Paste publicKey, serviceId, templateId into `emailjs` in `js/config.js`.
The form sends one email to the client and one to `ownerEmail`. Until configured, it opens the visitor's email app addressed to the owner (client in CC).

## Images and video
- Replace `assets/img/ph-1.svg` … `ph-6.svg` with real photos (keep names, or edit the HTML). Hero image: `assets/img/hero-ref.jpg`.
- Add TikTok video URLs in `tiktokVideos` (config.js). Tiles link out to TikTok.
- Add logo: replace the text logo in the `.logo` link, and set colors in `:root` of `css/style.css`.
