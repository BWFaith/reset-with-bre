/* ====== EDIT THIS FILE: business details, prices, email keys, TikTok links ====== */
window.SITE = {
  name: "Reset with Bre",
  phone: "+1 (904) 555-0123",
  phoneRaw: "+19045550123", // <- replace
  ownerEmail: "hello@resetwithbre.com", // <- replace (owner copy goes here)
  instagram: "https://www.instagram.com/resetwithbre/",
  tiktok: "https://www.tiktok.com/@resetwithbre", // <- replace with real TikTok profile
  tiktokVideos: [
    "https://www.tiktok.com/@resetwithbre/photo/7622312709647781151?is_from_webapp=1&sender_device=pc&web_id=7712055073152992775",
    "https://www.tiktok.com/@resetwithbre/video/7699282736896314655?is_from_webapp=1&sender_device=pc&web_id=7712055073152992775",
    "https://www.tiktok.com/@resetwithbre/video/7704320960408620318?is_from_webapp=1&sender_device=pc&web_id=7712055073152992775",
  ],
  // EmailJS (free at emailjs.com). Leave blank and the form falls back to opening the visitor's email app.
  emailjs: { publicKey: "", serviceId: "", templateId: "" },
  taxRate: 0, // e.g. 0.07
  services: {
    signature: {
      name: "75-Min Signature Massage",
      options: [
        { l: "60 minutes", p: 130 },
        { l: "75 minutes (signature)", p: 160 },
        { l: "90 minutes", p: 190 },
      ],
    },
    mld: {
      name: "Post-Surgical MLD",
      options: [
        { l: "Single session (60 min)", p: 150 },
        { l: "Package of 3", p: 420 },
        { l: "Package of 5", p: 675 },
      ],
    },
    deep: {
      name: "Deep Tissue Massage",
      options: [
        { l: "60 minutes", p: 140 },
        { l: "90 minutes", p: 200 },
      ],
    },
    prenatal: {
      name: "Prenatal Massage",
      options: [
        { l: "60 minutes", p: 135 },
        { l: "75 minutes", p: 165 },
      ],
    },
  },
  addons: [
    { l: "Aromatherapy", p: 15 },
    { l: "Hot stones", p: 25 },
    { l: "Scalp & foot ritual", p: 20 },
    { l: "Cupping", p: 30 },
  ],
  areas: [
    { l: "Jacksonville core (0–10 mi)", p: 0 },
    { l: "Greater Jacksonville (10–20 mi)", p: 20 },
    { l: "Outer area (20–30 mi)", p: 35 },
  ],
  times: [
    "9:00 AM",
    "11:00 AM",
    "1:00 PM",
    "3:00 PM",
    "5:00 PM",
    "7:00 PM",
  ],
};
