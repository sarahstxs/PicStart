import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import ComingSoonPage from "./pages/ComingSoonPage.jsx";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage.jsx";
import EmployeeFormPage from "./pages/EmployeeFormPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
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
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<EmployeeFormPage />} />
          <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
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
