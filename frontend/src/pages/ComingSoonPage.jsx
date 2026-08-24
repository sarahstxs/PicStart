export default function ComingSoonPage({ title }) {
  return (
    <section className="empty-page" aria-labelledby="coming-soon-title">
      <p className="eyebrow">Em construção</p>
      <h1 id="coming-soon-title">{title}</h1>
      <p>
        Esta área será criada em uma próxima etapa do projeto. Use o menu
        lateral para voltar à visão geral.
      </p>
    </section>
  );
}
