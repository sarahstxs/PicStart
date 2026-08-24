import { Link, useParams } from "react-router-dom";
import useEmployee from "../hooks/useEmployee.js";

const statusPresentation = {
  "UNDER REVIEW": {
    label: "Em análise",
    className: "status-analysis",
  },
  APPROVED: {
    label: "Aprovado",
    className: "status-approved",
  },
  REJECTED: {
    label: "Reprovado",
    className: "status-rejected",
  },
  HIRED: {
    label: "Contratado",
    className: "status-hired",
  },
};

function formatSalary(salary) {
  if (typeof salary !== "number") {
    return "—";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salary);
}

function getStatusPresentation(status) {
  return (
    statusPresentation[status?.toUpperCase()] ?? {
      label: status || "Sem status",
      className: "status-analysis",
    }
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { employee, isLoading, error } = useEmployee(id);

  if (isLoading) {
    return (
      <section className="page-state-card" aria-live="polite">
        <p className="eyebrow">Funcionário</p>
        <h1>Carregando dados...</h1>
        <p>Estamos consultando o funcionário de ID {id}.</p>
      </section>
    );
  }

  if (error || !employee) {
    return (
      <section className="page-state-card page-state-error" role="alert">
        <p className="eyebrow">Funcionário</p>
        <h1>Não foi possível carregar os dados</h1>
        <p>{error || "Funcionário não encontrado."}</p>
        <Link className="secondary-button inline-button" to="/employees">
          Voltar para a lista
        </Link>
      </section>
    );
  }

  const status = getStatusPresentation(employee.status);

  return (
    <section className="details-page" aria-labelledby="employee-details-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Funcionário #{employee.id}</p>
          <h1 id="employee-details-title">{employee.name}</h1>
          <p className="page-description">
            Consulte os dados retornados pela API Spring Boot.
          </p>
        </div>
        <Link className="secondary-button" to="/employees">
          Voltar para a lista
        </Link>
      </div>

      <article className="details-card">
        <div className="details-card-heading">
          <div>
            <p className="eyebrow">Cadastro</p>
            <h2>Informações principais</h2>
          </div>
          <span className={`status-badge ${status.className}`}>
            <span className="status-badge-dot" aria-hidden="true" />
            {status.label}
          </span>
        </div>

        <dl className="detail-grid">
          <Detail label="Nome completo" value={employee.name} />
          <Detail label="E-mail" value={employee.email} />
          <Detail label="Telefone" value={employee.phone} />
          <Detail label="Cargo" value={employee.post} />
          <Detail label="Departamento" value={employee.department} />
          <Detail label="Cidade" value={employee.city} />
          <Detail label="Salário" value={formatSalary(employee.salary)} />
          <Detail label="Administrador" value={employee.admin ? "Sim" : "Não"} />
        </dl>
      </article>
    </section>
  );
}
