export const statusOptions = [
  { value: "UNDER REVIEW", label: "Em análise" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "REJECTED", label: "Reprovado" },
  { value: "HIRED", label: "Contratado" },
  { value: "ACTIVE", label: "Ativo" },
];

const statusPresentation = Object.fromEntries(
  statusOptions.map((status) => [
    status.value,
    {
      label: status.label,
      className: `status-${status.value.toLowerCase().replaceAll(" ", "-")}`,
    },
  ]),
);

statusPresentation["UNDER REVIEW"].className = "status-analysis";
statusPresentation.APPROVED.className = "status-approved";
statusPresentation.REJECTED.className = "status-rejected";
statusPresentation.HIRED.className = "status-hired";
statusPresentation.ACTIVE.className = "status-approved";

export function getStatusPresentation(status) {
  return (
    statusPresentation[status?.toUpperCase()] ?? {
      label: status || "Sem status",
      className: "status-analysis",
    }
  );
}

export function formatSalary(salary) {
  if (typeof salary !== "number") {
    return "—";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salary);
}
