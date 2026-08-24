export default function OverviewPage() {
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

      <article className="welcome-card">
        <div className="welcome-illustration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Seu espaço de trabalho</p>
          <h2>O PicStart está pronto para crescer.</h2>
          <p>
            Nas próximas etapas, vamos adicionar os funcionários, indicadores
            e ações do sistema conectados à sua API Spring Boot.
          </p>
        </div>
      </article>
    </section>
  );
}
