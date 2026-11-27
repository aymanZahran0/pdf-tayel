export default function AdminSidebar({ onLogout }) {
  return (
    <aside>
      <div className="brand light">
        <span className="brand-mark">S</span>
        <span className="brand-name" dir="ltr"><span>Saudi</span><span className="brand-accent">TUV</span></span>
      </div>
      <div className="admin-label">مساحة الإدارة</div>
      <button className="side-link active">
        ▦ <span>المستندات</span>
      </button>
      <a className="side-link mobile-library-link" href="/">
        المكتبة
      </a>
      <div className="aside-bottom">
        <button className="side-link" onClick={onLogout}>
          ↪ <span>تسجيل الخروج</span>
        </button>
        <div className="profile">
          <span>إط</span>
          <div>
            <strong>إبراهيم طايل</strong>
            <small>مدير النظام</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
