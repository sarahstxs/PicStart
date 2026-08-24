import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useEmployee from "../hooks/useEmployee.js";
import {
  createEmployee,
  updateEmployee,
} from "../services/employeeService.js";

const initialForm = {
  name: "",
  password: "",
  email: "",
  phone: "",
  post: "",
  department: "",
  salary: "",
  city: "",
  status: "UNDER REVIEW",
  admin: false,
};

const statusOptions = [
  { value: "UNDER REVIEW", label: "Em análise" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "REJECTED", label: "Reprovado" },
  { value: "HIRED", label: "Contratado" },
  { value: "ACTIVE", label: "Ativo" },
];

function Field({ children, label, name, required = true, ...props }) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <input id={name} name={name} required={required} {...props} />
      {children}
    </label>
  );
}

function SelectField({ children, label, name, required = true, ...props }) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <select id={name} name={name} required={required} {...props}>
        {children}
      </select>
    </label>
  );
}

function mapEmployeeToForm(employee) {
  return {
    name: employee.name || "",
    password: "",
    email: employee.email || "",
    phone: employee.phone || "",
    post: employee.post || "",
    department: employee.department || "",
    salary: employee.salary ?? "",
    city: employee.city || "",
    status: employee.status || "UNDER REVIEW",
    admin: employee.admin ?? false,
  };
}

function FormState({ children, title, variant = "default" }) {
  return (
    <section className={`page-state-card page-state-${variant}`}>
      <p className="eyebrow">Funcionários</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function EmployeeEditorForm({ employee, id, isEditing }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() =>
    employee ? mapEmployeeToForm(employee) : initialForm,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      ...form,
      salary: Number(form.salary),
      admin: Boolean(form.admin),
    };

    try {
      if (isEditing) {
        delete payload.password;
        await updateEmployee(id, payload);
        navigate(`/employees/${id}`);
      } else {
        await createEmployee(payload);
        navigate("/employees");
      }
    } catch (requestError) {
      setSubmitError(
        requestError.message ||
          `Não foi possível ${isEditing ? "editar" : "cadastrar"} o funcionário.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageTitle = isEditing ? "Editar funcionário" : "Novo funcionário";
  const pageDescription = isEditing
    ? "Atualize os dados e salve a edição na API."
    : "Preencha os dados abaixo para enviar um novo cadastro à API.";

  return (
    <section className="form-page" aria-labelledby="employee-form-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Funcionários</p>
          <h1 id="employee-form-title">{pageTitle}</h1>
          <p className="page-description">{pageDescription}</p>
        </div>
        <Link className="secondary-button" to="/employees">
          Voltar para a lista
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-card-heading">
          <div>
            <h2>Dados do funcionário</h2>
            <p>Os campos marcados são obrigatórios.</p>
          </div>
        </div>

        <div className="form-grid">
          <Field
            label="Nome completo"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {!isEditing && (
            <Field
              label="Senha inicial"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          )}
          <Field
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Field
            label="Telefone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
          <Field
            label="Cargo"
            name="post"
            type="text"
            value={form.post}
            onChange={handleChange}
          />
          <Field
            label="Departamento"
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
          />
          <Field
            label="Cidade"
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />
          <Field
            label="Salário"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          {isEditing && (
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </SelectField>
          )}
        </div>

        <p className="form-help">
          {isEditing
            ? "A edição envia todos os campos usando PUT."
            : "O status inicial é definido pela API no momento do cadastro."}
        </p>

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <div className="form-actions">
          <Link className="secondary-button" to="/employees">
            Cancelar
          </Link>
          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar funcionário"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function EmployeeFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { employee, isLoading, error } = useEmployee(id);

  if (isEditing && isLoading) {
    return (
      <FormState title="Carregando funcionário...">
        <p>Estamos buscando os dados atuais para preencher o formulário.</p>
      </FormState>
    );
  }

  if (isEditing && (error || !employee)) {
    return (
      <FormState title="Não foi possível carregar o funcionário" variant="error">
        <p>{error || "Funcionário não encontrado."}</p>
        <Link className="secondary-button inline-button" to="/employees">
          Voltar para a lista
        </Link>
      </FormState>
    );
  }

  return (
    <EmployeeEditorForm
      key={id || "new"}
      employee={employee}
      id={id}
      isEditing={isEditing}
    />
  );
}
