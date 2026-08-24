import { useState } from "react";
import { Link } from "react-router-dom";
import useEmployees from "../hooks/useEmployees.js";
import { deleteEmployee } from "../services/employeeService.js";

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

function PageState({ children, title, variant = "default" }) {
  return (
    <section className={`page-state-card page-state-${variant}`}>
      <p className="eyebrow">Funcionários</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

export default function EmployeesPage() {
  const { employees, isLoading, error, reload } = useEmployees();
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function openDeleteModal(employee) {
    setDeleteError(null);
    setEmployeeToDelete(employee);
  }

  function closeDeleteModal() {
    if (!isDeleting) {
      setEmployeeToDelete(null);
      setDeleteError(null);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
      reload();
    } catch (requestError) {
      setDeleteError(
        requestError.message || "Não foi possível excluir o funcionário.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <PageState title="Carregando funcionários...">
        <p>Estamos consultando a API Spring Boot.</p>
      </PageState>
    );
  }

  if (error) {
    return (
      <PageState title="Não foi possível carregar os dados" variant="error">
        <p>{error}</p>
        <button className="retry-button" type="button" onClick={reload}>
          Tentar novamente
        </button>
      </PageState>
    );
  }

  if (employees.length === 0) {
    return (
      <PageState title="Nenhum funcionário encontrado" variant="empty">
        <p>A API respondeu, mas ainda não existem funcionários cadastrados.</p>
      </PageState>
    );
  }

  return (
    <section className="employees-page" aria-labelledby="employees-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pessoas</p>
          <h1 id="employees-title">Funcionários</h1>
          <p className="page-description">
            Consulte os funcionários cadastrados no sistema.
          </p>
        </div>
        <div className="page-heading-actions">
          <span className="data-badge">API conectada</span>
          <Link className="primary-button" to="/employees/new">
            Novo funcionário
          </Link>
        </div>
      </div>

      <article className="table-card">
        <div className="table-card-header">
          <div>
            <h2>Todos os funcionários</h2>
            <p>{employees.length} registros encontrados</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <caption className="sr-only">
              Lista de funcionários cadastrados
            </caption>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">Cargo</th>
                <th scope="col">Departamento</th>
                <th scope="col">Cidade</th>
                <th scope="col">Salário</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const status = getStatusPresentation(employee.status);

                return (
                  <tr key={`${employee.id}-${employee.email}`}>
                    <th scope="row">
                      <span className="employee-name">{employee.name}</span>
                    </th>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.post || "—"}</td>
                    <td>{employee.department}</td>
                    <td>{employee.city}</td>
                    <td>{formatSalary(employee.salary)}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        <span
                          className="status-badge-dot"
                          aria-hidden="true"
                        />
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          className="icon-action view-action"
                          to={`/employees/${employee.id}`}
                          aria-label={`Ver detalhes de ${employee.name}`}
                          title="Ver detalhes"
                        >
                          <ViewIcon />
                        </Link>
                        <Link
                          className="icon-action edit-action"
                          to={`/employees/${employee.id}/edit`}
                          aria-label={`Editar ${employee.name}`}
                          title="Editar funcionário"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          className="icon-action delete-action"
                          type="button"
                          onClick={() => openDeleteModal(employee)}
                          aria-label={`Excluir ${employee.name}`}
                          title="Excluir funcionário"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {employeeToDelete && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <section
            className="confirmation-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <p className="eyebrow">Atenção</p>
            <h2 id="delete-dialog-title">Excluir funcionário?</h2>
            <p id="delete-dialog-description">
              Você está prestes a excluir <strong>{employeeToDelete.name}</strong>.
              Essa ação não poderá ser desfeita.
            </p>

            {deleteError && (
              <p className="form-error" role="alert">
                {deleteError}
              </p>
            )}

            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                autoFocus
              >
                Cancelar
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir funcionário"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
