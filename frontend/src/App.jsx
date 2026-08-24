import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import ComingSoonPage from "./pages/ComingSoonPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";

function NotFoundPage() {
  return (
    <section className="empty-page" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Página não encontrada</h1>
      <p>Volte para a página inicial para continuar.</p>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route
            path="/employees"
            element={<ComingSoonPage title="Funcionários" />}
          />
          <Route
            path="/reports"
            element={<ComingSoonPage title="Relatórios" />}
          />
          <Route
            path="/settings"
            element={<ComingSoonPage title="Configurações" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
