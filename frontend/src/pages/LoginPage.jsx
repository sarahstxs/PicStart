import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(email.trim(), password);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Não foi possível entrar na conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand" aria-label="PicStart">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>
            <strong>PicStart</strong>
            <small>People admin</small>
          </span>
        </div>

        <div className="login-heading">
          <p className="eyebrow">Acesso administrativo</p>
          <h1 id="login-title">Bem-vindo de volta</h1>
          <p>Entre para acompanhar os dados e gerenciar os funcionários.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="login-email">
            <span>E-mail</span>
            <input
              id="login-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="seu@email.com"
              required
            />
          </label>

          <label className="form-field" htmlFor="login-password">
            <span>Senha</span>
            <input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              required
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary-button login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-demo" aria-label="Acesso de teste">
          <strong>Acesso para teste</strong>
          <span>RenanSantos@picpay.com</span>
          <span>Senha: 123</span>
        </div>
      </section>

      <aside className="login-aside" aria-label="Resumo do PicStart">
        <span className="login-aside-label">People admin</span>
        <h2>Decisões melhores começam com uma visão clara do time.</h2>
        <p>Consulte indicadores, acompanhe candidaturas e mantenha os dados da equipe em um só lugar.</p>
        <div className="login-aside-stat">
          <strong>People</strong>
          <span>Gestão simples e organizada</span>
        </div>
      </aside>
    </main>
  );
}
