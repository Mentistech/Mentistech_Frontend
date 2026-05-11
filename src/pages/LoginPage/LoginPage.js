import React, { useState } from 'react';
import { login, salvarSessao } from '../../services/auth.service';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !senha) return;

    setErro('');
    setLoading(true);

    try {
      const resposta = await login({ email, senha });
      salvarSessao(resposta);
      onLoginSuccess(resposta);
    } catch (err) {
      setErro(err.message || 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-text">Mentistech</span>
        </div>
        <p className="login-subtitle">Bem-vindo de volta</p>

        <div className="login-form">
          {erro && <div className="login-error">{erro}</div>}

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-button"
            onClick={handleSubmit}
            disabled={loading || !email || !senha}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <div className="login-footer">
          Não tem conta?{' '}
          <a onClick={onNavigateToRegister}>Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
