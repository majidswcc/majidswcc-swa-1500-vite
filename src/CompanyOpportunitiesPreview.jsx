import React, { useState } from "react";

export default function CompanyOpportunitiesPreview() {
  const [page, setPage] = useState("home");

  // قائمة الشركات
  const companies = [
    "ABB",
    "الخريف",
    "الراشد",
    "سيمنس",
    "الغويري",
    "نسما",
    "سيبكو",
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "Tahoma, sans-serif", padding: "1rem" }}>
      {/* الهيدر */}
      <header
        style={{
          background: "#1d4ed8",
          color: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>مبادرة تأهيل 1500 شاب وشابة</h1>
        <nav style={{ marginTop: "0.5rem" }}>
          <button onClick={() => setPage("home")} style={navBtn}>
            الرئيسية
          </button>
          <button onClick={() => setPage("about")} style={navBtn}>
            عن المشروع
          </button>
          <button onClick={() => setPage("companies")} style={navBtn}>
            فرص الشركات
          </button>
          <button onClick={() => setPage("charities")} style={navBtn}>
            فرص الجمعيات
          </button>
          <button onClick={() => setPage("register")} style={navBtn}>
            التسجيل
          </button>
        </nav>
      </header>

      {/* الصفحات */}
      {page === "home" && (
        <section>
          <h2>مرحبًا بكم</h2>
          <p>
            هذا المشروع يهدف إلى تأهيل وتوظيف 1500 شاب وشابة في المنطقة الشرقية
            عبر شراكات مع الشركات والجمعيات الخيرية.
          </p>
        </section>
      )}

      {page === "about" && (
        <section>
          <h2>عن المشروع</h2>
          <p>
            مشروع وطني بالشراكة مع صندوق تنمية الموارد البشرية (هدف) لتأهيل
            وتوظيف الشباب والشابات عبر برامج تدريبية وتوظيفية في الشركات الكبرى.
          </p>
        </section>
      )}

      {page === "companies" && (
        <section>
          <h2>فرص الشركات المشاركة</h2>
          <ul>
            {companies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {page === "charities" && (
        <section>
          <h2>فرص الجمعيات الخيرية</h2>
          <p>سيتم تخصيص 1500 فرصة موزعة بين الجمعيات الخيرية بالشرقية.</p>
        </section>
      )}

      {page === "register" && (
        <section>
          <h2>نموذج التسجيل</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("تم إرسال بياناتك بنجاح ✅");
            }}
            style={{ display: "grid", gap: "0.5rem", maxWidth: "400px" }}
          >
            <input placeholder="الاسم الكامل" required />
            <input placeholder="المدينة" required />
            <input placeholder="المؤهل الدراسي" />
            <input placeholder="المسار التدريبي المطلوب" />
            <input placeholder="رقم الجوال" type="tel" required />
            <input placeholder="البريد الإلكتروني" type="email" required />
            <button
              type="submit"
              style={{
                background: "#1d4ed8",
                color: "white",
                padding: "0.5rem",
                border: "none",
                borderRadius: "0.3rem",
              }}
            >
              إرسال
            </button>
          </form>
        </section>
      )}

      {/* الفوتر */}
      <footer
        style={{
          marginTop: "2rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        © 2025 أكاديمية المياه - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

const navBtn = {
  margin: "0 0.5rem",
  padding: "0.3rem 0.6rem",
  border: "none",
  borderRadius: "0.3rem",
  cursor: "pointer",
};
