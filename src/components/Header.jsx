export default function Header({ view, onChangeView }) {
  return (
    <header className="topbar">
      <button
        className="brand brand-button"
        onClick={() => onChangeView("library")}
      >
        <span className="brand-mark">S</span>
        <span className="brand-name" dir="ltr"><span>Saudi</span><span className="brand-accent">TUV</span></span>
      </button>
      <nav aria-label="التنقل الرئيسي">
        <button
          className={`nav-link ${view === "library" ? "active" : ""}`}
          onClick={() => onChangeView("library")}
        >
          المكتبة
        </button>
        <button
          className={`nav-link ${view === "admin" ? "active" : ""}`}
          onClick={() => onChangeView("admin")}
        >
          الإدارة
        </button>
      </nav>
    </header>
  );
}
