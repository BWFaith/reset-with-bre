(() => {
  "use strict";
  const S = window.SITE,
    $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) =>
    "$" + n.toFixed(2).replace(/\.00$/, "");
  /* header */
  const h = $(".hdr"),
    nav = $("nav"),
    bg = $(".burger");
  const sc = () =>
    h.classList.toggle("solid", scrollY > 40);
  sc();
  addEventListener("scroll", sc, { passive: true });
  bg &&
    bg.addEventListener("click", () => {
      const o = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", o);
      document.body.style.overflow = o ? "hidden" : "";
      bg.setAttribute("aria-expanded", o);
    });
  $$("nav a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    }),
  );
  /* reveal */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".rv").forEach((el, i) => {
    el.style.setProperty("--d", (i % 4) * 0.08 + "s");
    io.observe(el);
  });
  /* counters */
  const co = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const t = +e.target.dataset.n,
        s = e.target.dataset.s || "";
      let st = null;
      const f = (ts) => {
        st = st || ts;
        const p = Math.min((ts - st) / 1400, 1);
        e.target.textContent =
          Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
        p < 1 && requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }),
  );
  $$("[data-n]").forEach((el) => co.observe(el));
  /* car doors */
  const d = $(".doors");
  if (d) {
    const t = $(".dtoggle"),
      set = (o) => {
        d.classList.toggle("open", o);
        t.querySelector("span").textContent = o
          ? "Close the doors"
          : "Open the doors";
        t.setAttribute("aria-pressed", o);
      };
    setTimeout(() => set(true), 700);
    t.addEventListener("click", () =>
      set(!d.classList.contains("open")),
    );
  }
  /* quote engine */
  function quote(root, full) {
    const sv = S.services;
    let step = 0;
    const N = full ? 4 : 3;
    const svOpts = Object.entries(sv)
      .map(
        ([k, v], i) =>
          `<label class="opt"><span><input type="radio" name="svc" value="${k}" ${i ? "" : "checked"}>${v.name}</span></label>`,
      )
      .join("");
    root.innerHTML = `<h3>Get your free quote</h3><p class="sub">Takes under a minute. No payment today.</p><div class="steps">${"<b></b>".repeat(N)}</div>
<form novalidate>
<div class="step"><label>Choose your service</label><div class="opts">${svOpts}</div><label>Session length</label><div class="opts" data-dur></div></div>
${full ? `<div class="step"><label>Enhance your session (optional)</label><div class="opts">${S.addons.map((a, i) => `<label class="opt"><span><input type="checkbox" name="add" value="${i}">${a.l}</span><small>+${money(a.p)}</small></label>`).join("")}</div></div>` : ""}
<div class="step"><div class="row"><div><label>Preferred date</label><input type="date" name="date" required></div><div><label>Preferred time</label><select name="time">${S.times.map((t) => `<option>${t}</option>`).join("")}</select></div></div><label>Your area</label><select name="area">${S.areas.map((a, i) => `<option value="${i}">${a.l}${a.p ? ` (+${money(a.p)} travel)` : ""}</option>`).join("")}</select><label>Service address</label><input name="addr" placeholder="Street, city, ZIP" autocomplete="street-address" required></div>
<div class="step"><div class="row"><div><label>Full name</label><input name="name" autocomplete="name" required></div><div><label>Phone</label><input name="phone" type="tel" autocomplete="tel" required></div></div><label>Email (your quote is sent here)</label><input name="email" type="email" autocomplete="email" required><label>Notes (injuries, surgery date, pressure)</label><textarea name="notes"></textarea></div>
</form><div class="qbar"><div class="total"><small>Estimated total</small><span data-t>$0</span></div><div><button type="button" class="btn ghost" data-b style="display:none;min-height:44px;padding:0 18px">Back</button> <button type="button" class="btn" data-n>Next</button></div></div><div class="msg" role="status"></div>`;
    const f = $("form", root),
      steps = $$(".step", root),
      bars = $$(".steps b", root),
      nb = $("[data-n]", root),
      bb = $("[data-b]", root),
      m = $(".msg", root),
      dd = $("[data-dur]", root);
    const dt = f.date;
    const td = new Date(Date.now() + 864e5);
    dt.min = td.toISOString().slice(0, 10);
    const durs = () => {
      const k = f.svc.value;
      dd.innerHTML = sv[k].options
        .map(
          (o, i) =>
            `<label class="opt"><span><input type="radio" name="dur" value="${i}" ${i === (sv[k].options.length > 1 ? 1 : 0) ? "checked" : ""}>${o.l}</span><small>${money(o.p)}</small></label>`,
        )
        .join("");
    };
    const calc = () => {
      const k = f.svc.value,
        o = sv[k].options[+(f.dur.value || 0)],
        ad = $$("[name=add]:checked", f).map(
          (x) => S.addons[+x.value],
        ),
        ar = S.areas[+f.area.value];
      const sub =
          o.p + ad.reduce((a, b) => a + b.p, 0) + ar.p,
        tax = sub * S.taxRate;
      $("[data-t]", root).textContent = money(sub + tax);
      return {
        service: sv[k].name,
        duration: o.l,
        addons: ad.map((a) => a.l).join(", ") || "None",
        area: ar.l,
        travel: money(ar.p),
        total: money(sub + tax),
      };
    };
    const show = () => {
      steps.forEach((s, i) =>
        s.classList.toggle("on", i === step),
      );
      bars.forEach((b, i) =>
        b.classList.toggle("on", i <= step),
      );
      bb.style.display = step ? "" : "none";
      nb.textContent =
        step === N - 1 ? "Send my quote" : "Next";
      calc();
    };
    const ok = () => {
      const s = steps[step];
      for (const i of $$("input[required]", s)) {
        if (
          !i.value.trim() ||
          (i.type === "email" &&
            !/^\S+@\S+\.\S+$/.test(i.value))
        ) {
          i.focus();
          i.style.borderColor = "#a33a24";
          m.className = "msg err";
          m.textContent =
            "Please complete the highlighted field.";
          return false;
        }
        i.style.borderColor = "";
      }
      m.className = "msg";
      return true;
    };
    f.addEventListener("change", (e) => {
      if (e.target.name === "svc") durs();
      calc();
    });
    durs();
    bb.onclick = () => {
      step--;
      show();
    };
    nb.onclick = async () => {
      if (!ok()) return;
      if (step < N - 1) {
        step++;
        show();
        return;
      }
      nb.disabled = true;
      nb.textContent = "Sending…";
      const q = calc(),
        p = {
          ...q,
          name: f.name.value,
          email: f.email.value,
          phone: f.phone.value,
          date: f.date.value,
          time: f.time.value,
          address: f.addr.value,
          notes: f.notes.value || "—",
          owner_email: S.ownerEmail,
          business: S.name,
        };
      try {
        const E = S.emailjs;
        if (!E.publicKey) throw new Error("noemailjs");
        for (const to of [p.email, S.ownerEmail]) {
          const r = await fetch(
            "https://api.emailjs.com/api/v1.0/email/send",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                service_id: E.serviceId,
                template_id: E.templateId,
                user_id: E.publicKey,
                template_params: { ...p, to_email: to },
              }),
            },
          );
          if (!r.ok) throw new Error("fail");
        }
        m.className = "msg ok";
        m.textContent =
          "Thank you, " +
          p.name.split(" ")[0] +
          "! Your quote of " +
          q.total +
          " is on its way to " +
          p.email +
          ". Bre will confirm your appointment shortly.";
        nb.style.display = "none";
        bb.style.display = "none";
      } catch (e) {
        const body = `Booking request%0A%0AService: ${q.service} (${q.duration})%0AAdd-ons: ${q.addons}%0AArea: ${q.area}%0AEstimated total: ${q.total}%0ADate: ${p.date} ${p.time}%0AAddress: ${p.address}%0AName: ${p.name}%0APhone: ${p.phone}%0AEmail: ${p.email}%0ANotes: ${p.notes}`;
        m.className = "msg ok";
        m.innerHTML = `Almost done! Email delivery isn't connected yet, so tap below to send this request from your email app. <br><a class="btn" style="margin-top:10px" href="mailto:${S.ownerEmail}?cc=${encodeURIComponent(p.email)}&subject=Booking%20request%20-%20${encodeURIComponent(q.service)}&body=${body}">Send by email</a>`;
        nb.disabled = false;
        nb.textContent = "Send my quote";
      }
    };
    show();
  }
  $$("[data-quote]").forEach((r) =>
    quote(r, r.dataset.quote === "full"),
  );
  /* gallery */
  const fl = $$(".filters button");
  fl.forEach((b) =>
    b.addEventListener("click", () => {
      fl.forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      $$(".mas figure").forEach(
        (f) =>
          (f.style.display =
            b.dataset.f === "all" ||
            f.dataset.c === b.dataset.f
              ? ""
              : "none"),
      );
    }),
  );
  const lb = $(".lb");
  if (lb) {
    $$(".mas img").forEach((i) =>
      i.parentElement.addEventListener("click", () => {
        $("img", lb).src = i.src;
        lb.classList.add("on");
      }),
    );
    lb.addEventListener("click", () =>
      lb.classList.remove("on"),
    );
    addEventListener(
      "keydown",
      (e) =>
        e.key === "Escape" && lb.classList.remove("on"),
    );
  }
  $$(".ba").forEach((b) => {
    const r = $("input", b),
      t = $(".top", b),
      br = $(".bar", b);
    r.addEventListener("input", () => {
      t.style.clipPath = `inset(0 ${100 - r.value}% 0 0)`;
      br.style.left = r.value + "%";
    });
  });
  $$("[data-tk]").forEach(
    (a, i) => (a.href = S.tiktokVideos[i] || S.tiktok),
  );
  $$("[data-tel]").forEach((a) => {
    a.href = "tel:" + S.phoneRaw;
    if (!a.children.length) a.textContent = S.phone;
  });
  $$("[data-mail]").forEach((a) => {
    a.href = "mailto:" + S.ownerEmail;
    a.textContent = S.ownerEmail;
  });
  $$("[data-ig]").forEach((a) => (a.href = S.instagram));
  /* chat */
  const cb = $(".chat");
  if (cb) {
    const log = $(".cm", cb),
      F = {
        Prices:
          "Sessions start at " +
          money(S.services.deep.options[0].p - 10) +
          ". Use the free quote form for an exact price including travel.",
        "Service area":
          "Bre travels to you across Jacksonville, FL and nearby areas. Travel fees apply beyond 10 miles.",
        "Post-surgical":
          "Bre offers post-surgical lymphatic drainage (MLD). Please share your surgery date and surgeon's guidance when you book.",
        Hours:
          "Appointments run daily from 9 AM to 8 PM by request. Book ahead for weekends.",
      };
    const add = (t, c) => {
      const d = document.createElement("div");
      d.className = c;
      d.textContent = t;
      log.append(d);
      log.scrollTop = log.scrollHeight;
    };
    const ans = (q) => {
      add(q, "u");
      const k = Object.keys(F).find((k) =>
        q
          .toLowerCase()
          .includes(k.toLowerCase().split(" ")[0]),
      );
      setTimeout(
        () =>
          add(
            k
              ? F[k]
              : "I'd love to help! For anything specific, call " +
                  S.phone +
                  " or text Bre directly, or request a free quote on the Booking page.",
            "b",
          ),
        450,
      );
    };
    add(
      "Hi, I'm Bre's assistant. How can I help you today?",
      "b",
    );
    $(".cq", cb).innerHTML =
      Object.keys(F)
        .map((k) => `<button type="button">${k}</button>`)
        .join("") +
      `<a class="btn" style="min-height:36px;padding:0 14px;font-size:.8rem" href="booking.html">Book now</a>`;
    $(".cq", cb).addEventListener(
      "click",
      (e) =>
        e.target.tagName === "BUTTON" &&
        ans(e.target.textContent),
    );
    $("form", cb).addEventListener("submit", (e) => {
      e.preventDefault();
      const i = e.target.q;
      if (i.value.trim()) ans(i.value.trim());
      i.value = "";
    });
    $("#chatbtn").addEventListener("click", () => {
      cb.classList.toggle("on");
    });
    $("#sms").href = "sms:" + S.phoneRaw;
  }
})();
