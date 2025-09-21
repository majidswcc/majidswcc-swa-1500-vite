import React, { useEffect, useMemo, useRef, useState } from "react";

export default function CompanyOpportunitiesPreview() {
  // ===== Router (hash-based) =====
  const [route, setRoute] = useState(
    typeof window !== "undefined" ? window.location.hash.replace("#", "") || "/" : "/"
  );
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (path) => {
    window.location.hash = path;
  };

  // ===== Shared state =====
  const [companyId, setCompanyId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [youth, setYouth] = useState({
    name: "",
    city: "",
    degree: "",
    track: "",
    phone: "",
    email: "",
    source: "",
  });
  const [companyForm, setCompanyForm] = useState({
    name: "",
    city: "",
    contact: "",
    phone: "",
    email: "",
    role: "training",
    seats: "",
    notes: "",
  });

  // شعار (اختياري) ضع ملف public/academy-logo.png
  const LOGO_URL = "/academy-logo.png";

  // ===== Data: companies & opportunities =====
  const companies = [
    { id: "abb", name: "ABB" },
    { id: "alkhuraif", name: "الخريف" },
    { id: "alrashed", name: "الراشد" },
    { id: "siemens", name: "سيمنس" },
    { id: "alghuweiri", name: "الغويري" },
    { id: "nesma", name: "نسما" },
    { id: "sepco", name: "سيبكو" },
  ];

  const opportunities = {
    abb: [
      {
        id: "abb-01",
        title: "فني تشغيل وصيانة",
        dept: "تحكم وآتمتة",
        seats: 25,
        city: "الظهران",
        duration: 8,
        type: "تدريب",
        requirements: ["دبلوم كهرباء/إلكترونيات", "أساسيات السلامة"],
      },
      {
        id: "abb-02",
        title: "مساعد مهندس كهرباء",
        dept: "كهرباء",
        seats: 15,
        city: "الدمام",
        duration: 6,
        type: "تدريب",
        requirements: ["بكالوريوس كهرباء (أولوية)", "لغة إنجليزية أساسية"],
      },
    ],
    alkhuraif: [
      {
        id: "alkh-01",
        title: "فني مضخات مياه",
        dept: "ميكانيكا",
        seats: 20,
        city: "الأحساء",
        duration: 6,
        type: "تدريب",
        requirements: ["دبلوم ميكانيكا", "قدرة على العمل الميداني"],
      },
    ],
    alrashed: [
      {
        id: "rash-01",
        title: "منسق مشاريع",
        dept: "إدارة مشاريع",
        seats: 12,
        city: "الخبر",
        duration: 4,
        type: "تدريب",
        requirements: ["بكالوريوس هندسي/إداري", "إلمام بـ MS Project"],
      },
    ],
    siemens: [
      {
        id: "sie-01",
        title: "تقنيات الصيانة الكهربائية",
        dept: "كهرباء",
        seats: 30,
        city: "الدمام",
        duration: 8,
        type: "تدريب",
        requirements: ["دبلوم/بكالوريوس كهرباء", "سلامة كهربائية"],
      },
    ],
    alghuweiri: [
      {
        id: "ghu-01",
        title: "مشغل معدات ميداني",
        dept: "تشغيل",
        seats: 18,
        city: "القطيف",
        duration: 5,
        type: "تدريب",
        requirements: ["ثانوي فأعلى", "لياقة للعمل الميداني"],
      },
    ],
    nesma: [
      {
        id: "nes-01",
        title: "خدمة عملاء",
        dept: "خدمات",
        seats: 22,
        city: "الخبر",
        duration: 4,
        type: "تدريب",
        requirements: ["تواصل ممتاز", "أساسيات الحاسب"],
      },
      {
        id: "nes-02",
        title: "محاسب مبتدئ",
        dept: "مالية",
        seats: 10,
        city: "الدمام",
        duration: 6,
        type: "تدريب",
        requirements: ["بكالوريوس محاسبة", "إلمام بـ Excel"],
      },
    ],
    sepco: [
      {
        id: "sep-01",
        title: "فني سلامة صناعية",
        dept: "HSSE",
        seats: 16,
        city: "الجبيل",
        duration: 6,
        type: "تدريب",
        requirements: ["شهادة سلامة (أولوية)", "استعداد للعمل بنظام الورديات"],
      },
    ],
  };

  const selectedOpps = companyId ? opportunities[companyId] || [] : [];

  // ===== Charities =====
  const charities = [
    { id: "albir-dammam", name: "جمعية البر بالدمام", city: "الدمام", seats: 400 },
    { id: "etam", name: "جمعية إطعام", city: "الخبر", seats: 300 },
    { id: "aytam", name: "جمعية أيتام الشرقية", city: "الدمام", seats: 250 },
    { id: "tarabot", name: "جمعية ترابط", city: "الخبر", seats: 200 },
    { id: "wed", name: "جمعية ود الخيرية", city: "الخبر", seats: 150 },
    { id: "other", name: "جمعيات أخرى بالشرقية", city: "متفرقة", seats: 200 },
  ];

  // ===== Online map (Leaflet via CDN) =====
  const leafletReadyRef = useRef(false);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapError, setMapError] = useState("");
  const [onlineMap, setOnlineMap] = useState(true);

  function ensureLeaflet() {
    return new Promise((resolve) => {
      if (leafletReadyRef.current && window.L) return resolve(window.L);
      // CSS
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "1");
        document.head.appendChild(link);
      }
      // JS
      if (window.L) {
        leafletReadyRef.current = true;
        return resolve(window.L);
      }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.async = true;
      s.onload = () => {
        leafletReadyRef.current = true;
        setMapError("");
        resolve(window.L);
      };
      s.onerror = () => {
        setMapError("تعذّر تحميل مكتبة الخريطة من CDN.");
        resolve(null);
      };
      document.body.appendChild(s);
    });
  }

  // مدن الشرقية (lat,lng)
  const geo = {
    الدمام: [26.4207, 50.0888],
    الخبر: [26.2854, 50.2153],
    الظهران: [26.3049, 50.142],
    الجبيل: [27.0046, 49.646],
    القطيف: [26.558, 50.0103],
    الأحساء: [25.3833, 49.6],
    "رأس تنورة": [26.7082, 50.0619],
    رحيمة: [26.7073, 50.06],
  };

  const locations = [
    { id: "abb-dhahran", company: "abb", name: "ABB – الظهران", city: "الظهران", type: "training", seats: 60 },
    { id: "siemens-dammam", company: "siemens", name: "Siemens – الدمام", city: "الدمام", type: "training", seats: 85 },
    { id: "nesma-khobar", company: "nesma", name: "نسما – الخبر", city: "الخبر", type: "employment", seats: 40 },
    { id: "sepco-jubail", company: "sepco", name: "سيبكو – الجبيل", city: "الجبيل", type: "training", seats: 110 },
    { id: "alkhuraif-ahsa", company: "alkhuraif", name: "الخُريف – الأحساء", city: "الأحساء", type: "support", seats: 25 },
    { id: "alghuweiri-qatif", company: "alghuweiri", name: "الغُوَيْري – رحيمة/القطيف", city: "رحيمة", type: "employment", seats: 35 },
    { id: "alrashed-rasTanura", company: "alrashed", name: "الراشد – رأس تنورة", city: "رأس تنورة", type: "employment", seats: 20 },
  ];

  useEffect(() => {
    if (route === "/map" && onlineMap) ensureLeaflet();
  }, [route, onlineMap]);

  useEffect(() => {
    if (route !== "/map" || !onlineMap) return;
    let cancelled = false;
    ensureLeaflet().then((L) => {
      if (cancelled || !L) return;
      const el = document.getElementById("leaf-map");
      if (!el) return;

      if (!mapInstanceRef.current) {
        const map = L.map(el, { zoomControl: true, attributionControl: true }).setView([26.5, 50.1], 9);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap, © CARTO",
        }).addTo(map);
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (markersLayerRef.current) map.removeLayer(markersLayerRef.current);
      const layer = L.layerGroup();

      const filtered = locations
        .filter((loc) => (filterType === "all" ? true : loc.type === filterType))
        .filter((loc) =>
          query.trim() === ""
            ? true
            : (loc.city + " " + loc.name).toLowerCase().includes(query.toLowerCase())
        )
        .map((loc) => ({ ...loc, latlng: geo[loc.city] }))
        .filter((loc) => Array.isArray(loc.latlng));

      const iconByType = (t) =>
        L.divIcon({
          className: "custom-marker",
          html: `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 2px #fff;${t === "training"
            ? "background:#2563eb"
            : t === "employment"
            ? "background:#059669"
            : "background:#d97706"
          }"></span>`,
        });

      filtered.forEach((loc) => {
        const m = L.marker(loc.latlng, { icon: iconByType(loc.type) });
        const html = `
          <div style="direction:rtl;text-align:right;min-width:220px">
            <div style="font-weight:700;color:#1e40af">${loc.name}</div>
            <div style="color:#334155;font-size:12px">المدينة: ${loc.city} • النوع: ${
          loc.type === "training" ? "تدريب" : loc.type === "employment" ? "توظيف" : "دعم مجتمعي"
        }</div>
            <div style="margin-top:4px">المقاعد المتاحة: <b>${loc.seats}</b></div>
          </div>`;
        m.bindPopup(html);
        m.addTo(layer);
      });

      layer.addTo(map);
      markersLayerRef.current = layer;

      if (filtered.length) {
        const group = L.featureGroup(filtered.map((f) => L.marker(f.latlng)));
        map.fitBounds(group.getBounds().pad(0.2));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [route, onlineMap, filterType, query]);

  // ===== Form handlers =====
  const submitYouth = (e) => {
    e.preventDefault();
    alert(`تم استلام طلبك بنجاح للتقديم عبر ${youth.source || "المنصة"}. سنوافيك بالتفاصيل قريبًا.`);
    setYouth({ name: "", city: "", degree: "", track: "", phone: "", email: "", source: "" });
  };
  const submitCompany = (e) => {
    e.preventDefault();
    alert("شكرًا لتسجيل شركتكم. سنراجع الطلب ونتواصل خلال 3 أيام عمل.");
    setCompanyForm({
      name: "",
      city: "",
      contact: "",
      phone: "",
      email: "",
      role: "training",
      seats: "",
      notes: "",
    });
  };

  // ===== UI pieces =====
  const card = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    padding: "16px",
  };
  const btn = {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
  };
  const btnGhost = {
    background: "transparent",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
  };
  const input = { padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", width: "100%" };
  const label = { fontWeight: 600, marginBottom: 6, display: "block" };

  const Header = (
    <header style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={LOGO_URL}
          alt="شعار الأكاديمية"
          style={{ height: 40, width: "auto" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: 0, cursor: "pointer" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>أكاديمية المياه</span>
        </button>
      </div>
      <nav style={{ display: "flex", gap: 16 }}>
        <a onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>عن المشروع</a>
        <a onClick={() => navigate("/opps")} style={{ cursor: "pointer" }}>فرص الشركات</a>
        <a onClick={() => navigate("/charities")} style={{ cursor: "pointer" }}>فرص الجمعيات</a>
        <a onClick={() => navigate("/map")} style={{ cursor: "pointer" }}>الخريطة</a>
        <a onClick={() => navigate("/youth")} style={{ cursor: "pointer" }}>التسجيل للشباب</a>
        <a onClick={() => navigate("/companies")} style={{ cursor: "pointer" }}>تسجيل الشركات</a>
      </nav>
    </header>
  );

  const AboutPage = (
    <section style={{ ...card, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>عن المشروع</h1>
      <p style={{ color: "#334155", lineHeight: 1.8 }}>
        برنامج وطني لتمكين وتأهيل 1500 شاب وشابة في المنطقة الشرقية عبر شراكات مع صندوق تنمية الموارد البشرية (هدف)
        والشركات الرائدة الصناعية والخدمية. يهدف البرنامج إلى رفع قابلية التوظيف، ومواءمة المهارات مع احتياجات السوق،
        وتمكين حياة كريمة عبر التدريب المنتهي بالتوظيف والدعم المجتمعي.
      </p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div style={{ ...card, background: "#eff6ff" }}>
          <h3 style={{ marginTop: 0, color: "#1e3a8a" }}>الشركات المساهمة</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, color: "#334155" }}>
            <li>ABB – تحكم وآتمتة، كهرباء وصيانة صناعية</li>
            <li>سيمنس – كهرباء وأنظمة تشغيل</li>
            <li>الخريف – ميكانيكا ومضخات وأنظمة مياه</li>
            <li>الراشد – إدارة مشاريع وعمليات</li>
            <li>الغويري – تشغيل ميداني وبنية تحتية</li>
            <li>نسما – خدمة عملاء، مالية ومحاسبة</li>
            <li>سيبكو – HSSE وسلامة صناعية</li>
          </ul>
        </div>
        <div style={{ ...card, background: "#ecfdf5" }}>
          <h3 style={{ marginTop: 0, color: "#065f46" }}>ميثاق الشراكة والتدريب</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, color: "#334155" }}>
            <li>توفير مقاعد تدريبية/وظائف بحسب التخصصات المعلنة.</li>
            <li>الالتزام بمعايير السلامة والصحة المهنية HSSE طوال مدة التدريب.</li>
            <li>تقارير إنجاز وحضور ومؤشرات أداء شهرية للأكاديمية.</li>
            <li>التوظيف خلال 14 يومًا من نهاية التدريب.</li>
            <li>التزام الجمعيات بترشيح الأحق ومتابعة الأثر.</li>
          </ul>
        </div>
      </div>
    </section>
  );

  const OppsPage = (
    <section style={{ ...card }}>
      <h2 style={{ textAlign: "center", color: "#1e40af" }}>فرص الشركات المشاركة</h2>
      <div style={{ maxWidth: 640, margin: "0 auto 16px", display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ fontWeight: 600 }}>اختر الشركة:</label>
        <select style={{ ...input }} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
          <option value="">— اختر شركة —</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {companyId === "" ? (
        <p style={{ textAlign: "center", color: "#475569" }}>اختر شركة من القائمة للاطلاع على الفرص المتاحة.</p>
      ) : selectedOpps.length === 0 ? (
        <p style={{ textAlign: "center", color: "#475569" }}>لا توجد فرص منشورة حاليًا لهذه الشركة.</p>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {selectedOpps.map((op) => (
            <div key={op.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: 0, color: "#1e40af" }}>{op.title}</h3>
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    borderRadius: 999,
                    alignSelf: "center",
                  }}
                >
                  {op.type}
                </span>
              </div>
              <div style={{ color: "#334155", fontSize: 14, lineHeight: 1.8 }}>
                <div>القسم/التخصص: <b>{op.dept}</b></div>
                <div>الموقع: <b>{op.city}</b></div>
                <div>المدة: <b>{op.duration} أسابيع</b></div>
                <div>المقاعد المتاحة: <b>{op.seats}</b></div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontWeight: 600 }}>المتطلبات:</div>
                  <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                    {op.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <button onClick={() => navigate("/map")} style={{ ...btnGhost }}>
                  اعرض على الخريطة
                </button>
                <button
                  onClick={() => {
                    setYouth((y) => ({ ...y, source: companies.find((c) => c.id === companyId)?.name || "" }));
                    navigate("/youth");
                  }}
                  style={{ ...btn }}
                >
                  تقديم
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const CharitiesPage = (
    <section style={{ ...card }}>
      <h2 style={{ textAlign: "center", color: "#065f46" }}>فرص الجمعيات الخيرية بالمنطقة الشرقية</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        {charities.map((ch) => (
          <div key={ch.id} style={card}>
            <h3 style={{ marginTop: 0, color: "#047857" }}>{ch.name}</h3>
            <div style={{ color: "#334155" }}>
              <div>المدينة: <b>{ch.city}</b></div>
              <div>المقاعد المخصصة: <b>{ch.seats}</b></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                onClick={() => {
                  setYouth((y) => ({ ...y, source: ch.name }));
                  navigate("/youth");
                }}
                style={{ ...btn, background: "#059669" }}
              >
                تقديم
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const MapPage = (
    <section style={{ ...card }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, color: "#1e40af" }}>الخريطة التفاعلية – المنطقة الشرقية</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", background: "#fff", padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            <input type="checkbox" checked={onlineMap} onChange={(e) => setOnlineMap(e.target.checked)} />
            استخدام خريطة أونلاين (Leaflet)
          </label>
          <input
            placeholder="ابحث بالمدينة أو اسم الجهة"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ ...input, width: 220 }}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...input, width: 200 }}>
            <option value="all">كل الأنواع</option>
            <option value="training">تدريب</option>
            <option value="employment">توظيف</option>
            <option value="support">دعم مجتمعي</option>
          </select>
        </div>
      </div>

      {onlineMap ? (
        <div
          id="leaf-map"
          style={{
            width: "100%",
            height: "32rem",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {mapError && <div style={{ fontSize: 12, color: "#b91c1c" }}>{mapError} — تأكد من توفر الإنترنت.</div>}
        </div>
      ) : (
        <div style={{ ...card, marginTop: 12, background: "#f8fafc" }}>
          <b>خريطة أوفلاين (SVG)</b>
          <p style={{ color: "#475569", marginTop: 6 }}>
            وضع مبسّط في هذه النسخة. يمكنني إعادة دمج الخريطة الصناعية الكاملة (SVG) لاحقًا كما كانت في النسخة السابقة.
          </p>
        </div>
      )}

      <div style={{ ...card, marginTop: 12 }}>
        {selected ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#1e40af" }}>{selected.name}</div>
              <div style={{ fontSize: 13, color: "#475569" }}>
                المدينة: {selected.city} • النوع:{" "}
                {selected.type === "training" ? "تدريب" : selected.type === "employment" ? "توظيف" : "دعم مجتمعي"}
              </div>
              <div style={{ marginTop: 4, color: "#334155" }}>
                المقاعد المتاحة: <b>{selected.seats}</b>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigate("/opps")} style={btn}>
                اذهب إلى الفرص
              </button>
              <button onClick={() => setSelected(null)} style={btnGhost}>
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <div style={{ color: "#475569" }}>اختر نقطة على الخريطة للاطلاع على التفاصيل (في وضع الأونلاين).</div>
        )}
      </div>
    </section>
  );

  const YouthPage = (
    <section style={{ ...card }}>
      <h2 style={{ color: "#1e40af" }}>نموذج تسجيل الشباب</h2>
      <form onSubmit={submitYouth} style={{ display: "grid", gap: 10, maxWidth: 520, marginInline: "auto" }}>
        <input style={input} placeholder="الاسم الكامل" value={youth.name} onChange={(e) => setYouth({ ...youth, name: e.target.value })} required />
        <input style={input} placeholder="المدينة" value={youth.city} onChange={(e) => setYouth({ ...youth, city: e.target.value })} required />
        <input style={input} placeholder="المؤهل الدراسي" value={youth.degree} onChange={(e) => setYouth({ ...youth, degree: e.target.value })} />
        <input style={input} placeholder="المسار التدريبي المطلوب" value={youth.track} onChange={(e) => setYouth({ ...youth, track: e.target.value })} />
        <input style={input} placeholder="رقم الجوال" type="tel" value={youth.phone} onChange={(e) => setYouth({ ...youth, phone: e.target.value })} required />
        <input style={input} placeholder="البريد الإلكتروني" type="email" value={youth.email} onChange={(e) => setYouth({ ...youth, email: e.target.value })} required />
        {youth.source && (
          <div style={{ fontSize: 13, color: "#475569" }}>
            التقديم عبر: <b>{youth.source}</b>
          </div>
        )}
        <button type="submit" style={btn}>إرسال</button>
      </form>
    </section>
  );

  const CompaniesPage = (
    <section style={{ ...card }}>
      <h2 style={{ textAlign: "center", color: "#1e40af" }}>تسجيل الشركات المشاركة في المبادرة</h2>
      <form onSubmit={submitCompany} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", maxWidth: 980, marginInline: "auto" }}>
        <div>
          <label style={label}>اسم الشركة</label>
          <input style={input} required value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
        </div>
        <div>
          <label style={label}>المدينة</label>
          <input style={input} required value={companyForm.city} onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })} />
        </div>
        <div>
          <label style={label}>الدور</label>
          <select style={input} required value={companyForm.role} onChange={(e) => setCompanyForm({ ...companyForm, role: e.target.value })}>
            <option value="training">تدريب</option>
            <option value="employment">توظيف</option>
            <option value="support">دعم مجتمعي</option>
          </select>
        </div>
        <div>
          <label style={label}>شخص الاتصال</label>
          <input style={input} required value={companyForm.contact} onChange={(e) => setCompanyForm({ ...companyForm, contact: e.target.value })} />
        </div>
        <div>
          <label style={label}>رقم التواصل</label>
          <input style={input} required value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} />
        </div>
        <div>
          <label style={label}>البريد الإلكتروني</label>
          <input style={input} type="email" required value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} />
        </div>
        <div>
          <label style={label}>عدد المقاعد المقترحة</label>
          <input style={input} value={companyForm.seats} onChange={(e) => setCompanyForm({ ...companyForm, seats: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={label}>التخصصات المطلوبة / ملاحظات</label>
          <input style={input} value={companyForm.notes} onChange={(e) => setCompanyForm({ ...companyForm, notes: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1/-1", textAlign: "center" }}>
          <button style={btn}>إرسال الطلب</button>
        </div>
      </form>
    </section>
  );

  const HomePage = (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ ...card, background: "#eff6ff", textAlign: "center", padding: "40px 16px" }}>
        <h1 style={{ margin: 0, color: "#0f172a" }}>1500 فرصة.. بداية لمسيرة وطن</h1>
        <p style={{ color: "#334155" }}>من التأهيل إلى التوظيف.. معًا نصنع المستقبل</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => navigate("/opps")} style={btn}>تصفح فرص الشركات</button>
          <button onClick={() => navigate("/map")} style={btnGhost}>انتقل للخريطة</button>
        </div>
      </div>
      {AboutPage}
    </section>
  );

  const PageBody = useMemo(() => {
    switch (route) {
      case "/about":
        return AboutPage;
      case "/opps":
        return OppsPage;
      case "/charities":
        return CharitiesPage;
      case "/map":
        return MapPage;
      case "/youth":
        return YouthPage;
      case "/companies":
        return CompaniesPage;
      case "/":
      default:
        return HomePage;
    }
  }, [route, companyId, selectedOpps, filterType, query, selected, youth, companyForm, onlineMap, mapError]);

  return (
    <div dir="rtl" style={{ padding: 16, display: "grid", gap: 24 }}>
      {Header}
      {PageBody}
      <footer style={{ ...card, background: "#1e3a8a", color: "#fff", textAlign: "center" }}>
        © 2025 أكاديمية المياه - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
