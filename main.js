const $ = id => document.getElementById(id);
  const peso = n => "P" + n.toLocaleString("en-PH");
  const state = { service:null, design:null, date:"", time:"", pay:null };

  const SERVICES = [
    { id:"konsulta",   name:"Consultation",    note:"30 minutes, talk about your design", price:0 },
    { id:"flash",      name:"Flash tattoo",    note:"Small, ready-made design, 1 hour", price:1500 },
    { id:"maliit",     name:"Custom small",    note:"Up to 3 inches, 2 hours", price:3500 },
    { id:"katamtaman", name:"Custom medium",   note:"3 to 6 inches, 3 hours", price:7000 },
    { id:"touchup",    name:"Touch-up",        note:"Fix an older tattoo, 1 hour", price:1000 },
  ];
  const TIMES = ["11:00","13:00","15:00","17:00"];
  const PAYMENTS = [
    { id:"online", name:"Online",  note:"GCash \ Maya \ bank transfer" },
    { id:"card",   name:"Card",    note:"Credit or debit card" },
    { id:"cash",   name:"Cash",    note:"Pay at the studio" },
  ];
  let booked = {};
  try { booked = JSON.parse(localStorage.getItem("BlackthornBooked")) || {}; } catch (e) { booked = {}; }
  const saveBooked = () => { try { localStorage.setItem("BlackthornBooked", JSON.stringify(booked)); } catch (e) {} };
  const D = (cat, items) => items.split("|").map(x => {
    const [emoji, name] = x.split(" ");
    const cleanName = name.replace(/_/g, " ");
    const tags = `${cat},tattoo,${cleanName}`.replace(/\s+/g, ",");
    return ({
      cat,
      emoji,
      name: cleanName,
      src: `https://loremflickr.com/320/320/${encodeURIComponent(tags)}`
  });
  });
  const DESIGNS = [
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo10.jpg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo37.jpeg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo36.jpeg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo35.jpeg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo32.jpeg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo31.jpeg"},
    {cat: "Polynesian", name: "Polynesian", img: "image/Tattoo20.jpeg"},

    {cat: "Realistic", name: "Scorpion", img: "image/Tattoo13.jpeg"},
    {cat: "Realistic", name: "Spider", img: "image/Tattoo22.jpeg"},
    {cat: "Realistic", name: "Wolf eye", img: "image/Tattoo24.jpeg"},
    {cat: "Realistic", name: "Eye", img: "image/Tattoo27.jpeg"},
    {cat: "Realistic", name: "Wolf", img: "image/Tattoo33.jpeg"},
    {cat: "Realistic", name: "Butterfly", img: "image/Tattoo8.jpeg"},

    {cat: "Minimalist", name: "Star and Moon", img: "image/Tattoo12.jpeg"},
    {cat: "Minimalist", name: "Rose", img: "image/Tattoo17.jpeg"},
    {cat: "Minimalist", name: "Cross", img: "image/Tattoo21.jpeg"},
    {cat: "Minimalist", name: "Sun", img: "image/Tattoo34.jpeg"},
    {cat: "Minimalist", name: "Phoenix", img: "image/Tattoo26.jpeg"},
    {cat: "Minimalist", name: "", img: "image/Tattoo38.jpeg"},

    {cat: "Cartoon", name: "Pikachu", img: "image/Tattoo9.jpeg"},
    {cat: "Cartoon", name: "Snoopy", img: "image/Tattoo11.jpeg"},
    {cat: "Cartoon", name: "Tom", img: "image/Tattoo14.jpeg"},
    {cat: "Cartoon", name: "Minion", img: "image/Tattoo16.jpeg"},
    {cat: "Cartoon", name: "Baby Yoda", img: "image/Tattoo28.jpeg"},
    {cat: "Cartoon", name: "Panda", img: "image/Tattoo25.jpeg"},

    {cat: "Stitch", name: "Wink", img: "image/Tattoo23.jpeg"},
    {cat: "Stitch", name: "Ice Cream", img: "image/Tattoo19.jpeg"},
    {cat: "Stitch", name: "Female Stitch", img: "image/Tattoo15.jpeg"},
    {cat: "Stitch", name: "Love", img: "image/Tattoo18.jpeg"},
    {cat: "Stitch", name: "Stitch", img: "image/Tattoo29.jpeg"},
    {cat: "Stitch", name: "Balloon", img: "image/Tattoo30.jpeg"},
  ];

  const CUSTOM = {
    name:"Own design",
    emoji:"⬜️",
    cat:"",
    src:"https://picsum.photos/320/320",
    custom:true
  };
  const CATS = ["All", ...new Set(DESIGNS.map(d => d.cat))];
  let cat = "All", query = "";

  function show(n){
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("on", v.id === "v" + n));
    ["e1","e2","e4"].forEach(e => $(e).textContent = "");
    $("bar").style.width = (n / 5 * 100) + "%";
    window.scrollTo(0,0);
  }
  document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => show(b.dataset.go));
  const fail = (id, msg) => { $(id).textContent = msg; };

  $("start").onclick =() => show(1)

  $("next1").onclick = () => {
    if ($("name").value.trim().length < 2) return fail("e1", "Please enter your name.");
    if ($("address").value.trim().length < 5) return fail("e1", "Please enter your address.");
    if (!/^[0-9+\s-]{10,15}$/.test($("phone").value.trim())) return fail("e1", "Please enter a valid contact number.");
    if (!$("age").checked) return fail("e1", "You must be 18 or above to book.");
    show(2);
  };
  SERVICES.forEach(s => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.setAttribute("aria-pressed","false");
    b.innerHTML = `<span>${s.name}<small>${s.note}<\small><\span><span class="price">${peso(s.price)}<\span>`;
    b.onclick = () => { state.service = s;
      document.querySelectorAll("#services .opt").forEach(x => x.setAttribute("aria-pressed", x === b)); };
    $("services").appendChild(b);
  });

  const emojiArt = d => {
    const a = document.createElement("div");
    a.className = "art";
    a.textContent = d.emoji || "Tattoo";
    a.setAttribute("aria-hidden", "true");
    return a;
  };

  const artFor = d => {
    const img = document.createElement("img");
    img.className = "design-image";
    img.src = d.img || d.src;
    img.alt = `${d.name} tattoo design`;
    img.loading = "lazy";
    img.onerror = function () {
      this.replaceWith(emojiArt(d));
    };
    return img;
  };

  function renderDesigns(){
    const q = query.trim().toLowerCase();
    const list = DESIGNS.filter(d => (cat === "All" || d.cat === cat) && d.name.toLowerCase().includes(q));
    $("designs").innerHTML = "";
    [CUSTOM, ...list].forEach(d => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-pressed", state.design === d);
      const label = document.createElement("span"); label.textContent = d.name;
      b.append(artFor(d), label);
      b.onclick = () => { state.design = d; renderDesigns(); };
      $("designs").appendChild(b);
    });
  }
  CATS.forEach(c => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = c; b.setAttribute("aria-pressed", c === cat);
    b.onclick = () => { cat = c; document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); renderDesigns(); };
    $("chips").appendChild(b);
  });
  $("dsearch").oninput = e => { query = e.target.value; renderDesigns(); };

  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("date").min = today.toISOString().slice(0,10);
  $("date").onchange = e => { state.date = e.target.value; state.time = ""; renderSlots(); };

  function renderSlots(){
    $("slots").innerHTML = "";
    const taken = booked[state.date] || [];
    TIMES.forEach(t => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.textContent = t;
      const now = new Date();
      const isToday = state.date === now.toLocaleDateString("en-CA");
      const passed = isToday && (+t.slice(0,2) * 60 <= now.getHours() * 60 + now.getMinutes());
      b.disabled = !state.date || taken.includes(t) || passed;
      b.setAttribute("aria-pressed", state.time === t);
      b.onclick = () => { state.time = t; renderSlots(); };
      $("slots").appendChild(b);
    });
  }

  const dateText = () => new Date(state.date + "T00:00").toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  $("next2").onclick = () => {
    if (!state.service) return fail("e2", "Please choose a service.");
    if (!state.design)  return fail("e2", "Please choose a design.");
    if (state.design.custom && !$("idea").value.trim()) return fail("e2", "Please describe your own design.");
    if (!state.date)    return fail("e2", "Please choose a date.");
    if (!state.time)    return fail("e2", "Please choose a time.");

    const rows = [
      ["Name", $("name").value.trim()],
      ["Address", $("address").value.trim()],
      ["Contact number", $("phone").value.trim()],
      ["Service", state.service.name],
      ["Design", state.design.name + ($("idea").value.trim() ? " - " + $("idea").value.trim() : "")],
      ["Body part", $("place").value.trim() || "-"],
      ["Date", dateText()],
      ["Time", state.time],
    ];
    $("summary").innerHTML = "";
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = k; dd.textContent = v;
      $("summary").append(dt, dd);
    });
    $("total").textContent = $("total2").textContent = peso(state.service.price);
    show(3);
  };

  $("no").onclick  = () => show(2); 
  $("yes").onclick = () => show(4);
  
  PAYMENTS.forEach(p => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.setAttribute("aria-pressed","false");
    b.innerHTML = `<span>${p.name}<small>${p.note}<\small><\span>`;
    b.onclick = () => {
      state.pay = p;
      document.querySelectorAll("#pay .opt").forEach(x => x.setAttribute("aria-pressed", x === b));
      $("cardBox").style.display = p.id === "card" ? "block" : "none";
      $("payNote").textContent = p.id === "online" ? "You will receive payment instructions after booking."
                               : p.id === "cash" ? "Please bring the exact amount on your appointment day." : "";
      $("e4").textContent = "";
    };
    $("pay").appendChild(b);
  });

  $("paybtn").onclick = () => {
    if (!state.pay) return fail("e4", "Please choose a payment method.");
    if (state.pay.id === "card") {
      if (!/^[0-9\s]{13,19}$/.test($("cnum").value.trim())) return fail("e4", "Please enter a valid card number.");
      if (!/^\d{2}\/\d{2}$/.test($("cexp").value.trim())) return fail("e4", "Expiry should look like MM\YY.");
      if (!/^\d{3,4}$/.test($("ccvv").value.trim())) return fail("e4", "Please enter a valid CVV.");
    }
    (booked[state.date] ||= []).push(state.time);
    saveBooked();
    const ref = "Blckthrn-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    $("thanksText").textContent =
      `${$("name").value.trim()}, your ${state.service.name} is booked for ${dateText()} at ${state.time}. ` +
      `Payment: ${state.pay.name}. We will contact you at ${$("phone").value.trim()}.`;
    $("ref").textContent = "Booking reference: " + ref;
    $("cnum").value = $("cexp").value = $("ccvv").value = "";   // hindi iniiwan ang card info
    show(5);
  };
  $("again").onclick = () => {
    state.service = state.design = state.pay = null; state.date = state.time = "";
    ["name","address","phone","idea","place","date"].forEach(id => $(id).value = "");
    $("age").checked = false;
    document.querySelectorAll(".opt").forEach(x => x.setAttribute("aria-pressed","false"));
    $("cardBox").style.display = "none"; $("payNote").textContent = "";
    renderSlots(); renderDesigns(); show(0);
  };

  $("phone").oninput = e => { e.target.value = e.target.value.replace(/[^0-9+\s-]/g, ""); };
  $("cnum").oninput = e => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
  };
  $("cexp").oninput = e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
  };
  $("ccvv").oninput = e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4); };

  ["name","address","phone"].forEach(id => $(id).onkeydown = e => { if (e.key === "Enter") $("next1").click(); });

  renderSlots(); renderDesigns();
