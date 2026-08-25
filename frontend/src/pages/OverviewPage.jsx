import useIndicators from "../hooks/useIndicators.js";

const indicatorCards = [
  {
    key: "TOTAL",
    label: "Total de funcionários",
    tone: "indicator-total",
  },
  {
    key: "UNDER REVIEW",
    label: "Em análise",
    tone: "indicator-analysis",
  },
  {
    key: "APPROVED",
    label: "Aprovados",
    tone: "indicator-approved",
  },
  {
    key: "HIRED",
    label: "Contratados",
    tone: "indicator-hired",
  },
  {
    key: "REJECTED",
    label: "Reprovados",
    tone: "indicator-rejected",
  },
];

const statusBreakdown = indicatorCards.slice(1);

function formatIndicator(value) {
  return typeof value === "number"
    ? new Intl.NumberFormat("pt-BR").format(value)
    : "—";
}

export default function OverviewPage() {
  const { indicators, isLoading, error, reload } = useIndicators();
  const fallbackTotal = [
    "UNDER REVIEW",
    "APPROVED",
    "REJECTED",
    "HIRED",
    "ACTIVE",
  ].reduce((total, key) => total + (indicators?.[key] ?? 0), 0);

  const values = {
    ...indicators,
    TOTAL: indicators?.TOTAL ?? fallbackTotal,
  };

  return (
    <section className="overview-page" aria-labelledby="overview-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1 id="overview-title">Olá, admin 👋</h1>
          <p className="page-description">
            Acompanhe a jornada dos funcionários em um só lugar.
          </p>
        </div>
        <span className="date-label">24 de agosto de 2026</span>
      </div>

      <section
        className="indicators-section"
        aria-labelledby="indicators-title"
        aria-busy={isLoading}
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Acompanhamento</p>
            <h2 id="indicators-title">Indicadores do time</h2>
          </div>
          {error && (
            <button className="retry-button" type="button" onClick={reload}>
              Tentar novamente
            </button>
          )}
        </div>

        {error ? (
          <p className="inline-error" role="alert">
            {error}
          </p>
        ) : (
          <div className="indicator-grid">
            {indicatorCards.map((card) => (
              <article className={`indicator-card ${card.tone}`} key={card.key}>
                <span className="indicator-icon" aria-hidden="true" />
                <div>
                  <p>{card.label}</p>
                  <strong>{
                    isLoading ? "—" : formatIndicator(values[card.key])
                  }</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {!isLoading && !error && (
        <article className="status-overview-card">
          <div className="status-overview-heading">
            <div>
              <p className="eyebrow">Distribuição dos candidatos</p>
              <h2>Panorama por status</h2>
            </div>
            <span>{formatIndicator(values.TOTAL)} no total</span>
          </div>

          <div className="status-breakdown-list">
            {statusBreakdown.map((status) => {
              const count = values[status.key] ?? 0;
              const percentage = values.TOTAL
                ? Math.round((count / values.TOTAL) * 100)
                : 0;

              return (
                <div
                  className="status-breakdown-row"
                  key={status.key}
                  aria-label={`${status.label}: ${count} de ${values.TOTAL}`}
                >
                  <div className="status-breakdown-label">
                    <span className={`status-breakdown-dot ${status.tone}`} />
                    <span>{status.label}</span>
                    <strong>{formatIndicator(count)}</strong>
                  </div>
                  <div
                    className="status-breakdown-track"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax={values.TOTAL}
                    aria-valuenow={count}
                    aria-label={`${percentage}% dos funcionários`}
                  >
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      )}
    </section>
  );
}
