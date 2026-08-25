import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useEmployee from "../hooks/useEmployee.js";
import { updateEmployeePartial } from "../services/employeeService.js";
import {
  formatSalary,
  getStatusPresentation,
  statusOptions,
} from "../utils/employeePresentation.js";

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function PartialUpdateForm({ employee, onUpdated }) {
  const [form, setForm] = useState({
    salary: employee.salary ?? "",
    status: employee.status || "UNDER REVIEW",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {};
    const salary = form.salary === "" ? null : Number(form.salary);

    if (form.status !== employee.status) {
      payload.status = form.status;
    }

    if (salary !== null && salary !== Number(employee.salary)) {
      payload.salary = salary;
    }

    if (Object.keys(payload).length === 0) {
      setFeedback({
        type: "error",
        message: "Altere o status ou o salário para enviar um PATCH.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedEmployee = await updateEmployeePartial(employee.id, payload);
      setForm({
        salary: updatedEmployee.salary ?? salary,
        status: updatedEmployee.status || form.status,
      });
      onUpdated(updatedEmployee);
      setFeedback({
        type: "success",
        message: "Atualização parcial enviada com PATCH.",
      });
    } catch (requestError) {
      setFeedback({
        type: "error",
        message: requestError.message || "Não foi possível atualizar os dados.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="patch-card">
      <div className="patch-card-heading">
        <div>
          <p className="eyebrow">Atualização parcial</p>
          <h2>Alterar status ou salário</h2>
          <p>Somente os campos modificados serão enviados para a API.</p>
        </div>
        <span className="method-badge">PATCH</span>
      </div>

      <form className="patch-form" onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="patch-status">
          <span>Status</span>
          <select
            id="patch-status"
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field" htmlFor="patch-salary">
          <span>Salário</span>
          <input
            id="patch-salary"
            type="number"
            min="0"
            step="0.01"
            value={form.salary}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                salary: event.target.value,
              }))
            }
          />
        </label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar PATCH"}
        </button>
      </form>

      {feedback && (
        <p
          className={
            feedback.type === "success" ? "success-message" : "form-error"
          }
          role={feedback.type === "success" ? "status" : "alert"}
        >
          {feedback.message}
        </p>
      )}
    </article>
  );
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { employee, isLoading, error, replaceEmployee } = useEmployee(id);

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
        </dl>
      </article>

      <PartialUpdateForm
        key={employee.id}
        employee={employee}
        onUpdated={replaceEmployee}
      />
    </section>
  );
}
