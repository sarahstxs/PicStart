import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  { label: "Visão geral", path: "/", icon: "⌂" },
  { label: "Funcionários", path: "/employees", icon: "◎" },
  { label: "Relatórios", path: "/reports", icon: "▣" },
  { label: "Configurações", path: "/settings", icon: "⚙" },
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Menu principal">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span className="brand-copy">
            <strong>PicStart</strong>
            <small>People admin</small>
          </span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Workspace</p>
          {menuItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
              key={item.path}
              to={item.path}
              end={item.path === "/"}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-link-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          <span>Ambiente local</span>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Gestão de pessoas</p>
            <p className="topbar-title">Painel administrativo</p>
          </div>

          <div className="profile" aria-label="Usuário administrador">
            <span className="avatar" aria-hidden="true">
              AD
            </span>
            <span className="profile-copy">
              <strong>Admin</strong>
              <small>Administrador</small>
            </span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
