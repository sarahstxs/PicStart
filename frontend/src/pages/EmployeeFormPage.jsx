import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useEmployee from "../hooks/useEmployee.js";
import {
  createEmployee,
  updateEmployee,
  updateEmployeePartial,
} from "../services/employeeService.js";
import { statusOptions } from "../utils/employeePresentation.js";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  post: "",
  department: "",
  salary: "",
  city: "",
  status: "ACTIVE",
};

function Field({ children, label, name, required = false, ...props }) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <input id={name} name={name} required={required} {...props} />
      {children}
    </label>
  );
}

function SelectField({ children, label, name, required = false, ...props }) {
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
    email: employee.email || "",
    phone: employee.phone || "",
    post: employee.post || "",
    department: employee.department || "",
    salary: employee.salary ?? "",
    city: employee.city || "",
    status: employee.status || "UNDER REVIEW",
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
  const [initialValues] = useState(() =>
    employee ? mapEmployeeToForm(employee) : initialForm,
  );
  const [form, setForm] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function getChangedFields() {
    const changed = {};
    for (const key of Object.keys(form)) {
      const current = key === "salary" ? String(form[key] ?? "") : String(form[key] ?? "");
      const initial = key === "salary" ? String(initialValues[key] ?? "") : String(initialValues[key] ?? "");
      if (current !== initial) {
        changed[key] = form[key];
      }
    }
    if ("salary" in changed) {
      changed.salary = changed.salary === "" ? 0 : Number(changed.salary);
    }
    return changed;
  }

  const changedFields = isEditing ? getChangedFields() : {};
  const changedCount = Object.keys(changedFields).length;
  const totalFields = Object.keys(initialValues).length;
  const isAllChanged = isEditing && changedCount === totalFields && changedCount > 0;
  const willUsePut = isAllChanged;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing) {
        const changed = getChangedFields();
        if (Object.keys(changed).length === 0) {
          setSubmitError("Nenhuma alteração detectada.");
          return;
        }
        const allChanged = Object.keys(changed).length === totalFields;
        if (allChanged) {
          await updateEmployee(id, {
            ...form,
            salary: form.salary === "" ? 0 : Number(form.salary),
          });
        } else {
          const patchPayload = { ...changed };
          if ("salary" in patchPayload) {
            patchPayload.salary = patchPayload.salary === "" ? 0 : Number(patchPayload.salary);
          }
          await updateEmployeePartial(id, patchPayload);
        }
        navigate(`/employees/${id}`);
      } else {
        const payload = {
          ...form,
          salary: form.salary === "" ? 0 : Number(form.salary),
        };
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
            required
          />
          <Field
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
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
            required
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
            ? willUsePut
              ? "Todos os campos alterados → será usado PUT (substituição total)."
              : changedCount > 0
                ? `Alteração parcial (${changedCount}/${totalFields}) → será usado PATCH.`
                : "Altere ao menos um campo. Todos alterados = PUT, parcial = PATCH."
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
            title={isEditing ? (willUsePut ? "PUT - todos os campos" : "PATCH - parcial") : undefined}
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? willUsePut
                  ? "Salvar com PUT"
                  : changedCount > 0
                    ? "Salvar com PATCH"
                    : "Salvar alterações"
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
