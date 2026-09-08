import { useState } from "react";
import { useNavigate } from "react-router";

import HeartIcon from "../../assets/icons/HeartIcon";

import "./Login.css";

const eyeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const eyeOffIcon = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Password incorreta.");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Não foi possível fazer login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login">
      <div className="login-hero" aria-hidden="true">
        <div className="login-quote">
          <HeartIcon size={26} className="login-quote-heart" />
          <p>Cada foto, uma memória</p>
        </div>
      </div>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-brand">
            <span className="login-monogram">C&amp;D</span>
          </div>

          <h1 className="login-title">As memórias do nosso casamento</h1>

          <p className="login-subtitle">Introduz a password para entrar.</p>

          <label className="login-label" htmlFor="login-password">
            Password
          </label>
          <div className="login-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              autoFocus
            />
            <button
              type="button"
              className="login-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Esconder password" : "Mostrar password"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
