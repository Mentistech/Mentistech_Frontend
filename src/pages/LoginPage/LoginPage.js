import React, { useState } from 'react';
import { login, register, saveToken, savePerfilLocal } from '../../services/api';
import './LoginPage.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskCPF(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

function calcularForcaSenha(senha) {
  if (!senha) return { nivel: 0, label: '', cor: '' };
  let pontos = 0;
  if (senha.length >= 6) pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  const niveis = [
    { nivel: 1, label: 'Muito fraca', cor: '#e53e3e' },
    { nivel: 2, label: 'Fraca',       cor: '#dd6b20' },
    { nivel: 3, label: 'Média',       cor: '#d69e2e' },
    { nivel: 4, label: 'Forte',       cor: '#38a169' },
    { nivel: 5, label: 'Forte',       cor: '#38a169' },
  ];
  return niveis[Math.min(pontos, 5) - 1] || { nivel: 0, label: '', cor: '' };
}

function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });

  const [registerForm, setRegisterForm] = useState({
    nome: '', email: '', dataNascimento: '', genero: 'Feminino',
    cpf: '', telefone: '', senha: '', confirmaSenha: '', papel: 'COLABORADOR',
  });
  const [registerTouched, setRegisterTouched] = useState({});

  const touch = (field) => setRegisterTouched((prev) => ({ ...prev, [field]: true }));

  // Validações em tempo real
  const nomeValido = registerForm.nome.trim().length >= 2;
  const emailValido = EMAIL_REGEX.test(registerForm.email);
  const idade = calcularIdade(registerForm.dataNascimento);
  const idadeValida = idade !== null && idade >= 13;
  const cpfValido = registerForm.cpf.replace(/\D/g, '').length === 11;
  const telefoneValido = registerForm.telefone.replace(/\D/g, '').length >= 10;
  const forca = calcularForcaSenha(registerForm.senha);
  const senhasIguais = registerForm.senha === registerForm.confirmaSenha;
  const formValido =
    nomeValido && emailValido && idadeValida && cpfValido && telefoneValido &&
    forca.nivel >= 1 && registerForm.confirmaSenha && senhasIguais;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(loginForm.email, loginForm.senha);
      saveToken(data.token);
      onLogin({ nome: data.nome, papel: data.papel, usuarioId: data.usuarioId });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formValido) return;
    setError('');
    setLoading(true);
    try {
      const data = await register(
        registerForm.nome.trim(),
        registerForm.email,
        registerForm.senha,
        registerForm.papel,
      );
      saveToken(data.token);
      savePerfilLocal(data.usuarioId, {
        dataNascimento: registerForm.dataNascimento,
        genero: registerForm.genero,
        cpf: registerForm.cpf,
        telefone: registerForm.telefone,
      });
      onLogin({ nome: data.nome, papel: data.papel, usuarioId: data.usuarioId });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">Mentistech</h1>
        <p className="login-subtitle">Saúde mental corporativa</p>

        <div className="login-tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Entrar
          </button>
          <button
            className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Cadastrar
          </button>
        </div>

        {error && <p className="login-error">{error}</p>}

        {tab === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                required
                value={loginForm.senha}
                onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>

            {/* Nome */}
            <div className="form-group">
              <label>Nome e sobrenome</label>
              <input
                type="text"
                placeholder="Ex: Maria Silva"
                value={registerForm.nome}
                onChange={(e) => setRegisterForm({ ...registerForm, nome: e.target.value })}
                onBlur={() => touch('nome')}
                className={registerTouched.nome && !nomeValido ? 'input-error' : ''}
              />
              {registerTouched.nome && !nomeValido && (
                <span className="field-error">Mínimo de 2 caracteres</span>
              )}
            </div>

            {/* E-mail */}
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="text"
                placeholder="exemplo@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                onBlur={() => touch('email')}
                className={registerTouched.email && !emailValido ? 'input-error' : ''}
              />
              {registerTouched.email && !emailValido && (
                <span className="field-error">Formato de e-mail inválido</span>
              )}
            </div>

            {/* Data de nascimento */}
            <div className="form-group">
              <label>
                Data de nascimento
                {idade !== null && (
                  <span className="idade-label"> — {idade} anos</span>
                )}
              </label>
              <input
                type="date"
                value={registerForm.dataNascimento}
                onChange={(e) => setRegisterForm({ ...registerForm, dataNascimento: e.target.value })}
                onBlur={() => touch('dataNascimento')}
                max={new Date().toISOString().split('T')[0]}
                className={registerTouched.dataNascimento && !idadeValida ? 'input-error' : ''}
              />
              {registerTouched.dataNascimento && registerForm.dataNascimento && !idadeValida && (
                <span className="field-error">É necessário ter pelo menos 13 anos</span>
              )}
            </div>

            {/* Gênero */}
            <div className="form-group">
              <label>Gênero</label>
              <select
                value={registerForm.genero}
                onChange={(e) => setRegisterForm({ ...registerForm, genero: e.target.value })}
              >
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não informar">Prefiro não informar</option>
              </select>
            </div>

            {/* CPF */}
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={registerForm.cpf}
                onChange={(e) => setRegisterForm({ ...registerForm, cpf: maskCPF(e.target.value) })}
                onBlur={() => touch('cpf')}
                className={registerTouched.cpf && !cpfValido ? 'input-error' : ''}
              />
              {registerTouched.cpf && !cpfValido && (
                <span className="field-error">CPF inválido — informe os 11 dígitos</span>
              )}
            </div>

            {/* Telefone */}
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={registerForm.telefone}
                onChange={(e) => setRegisterForm({ ...registerForm, telefone: maskPhone(e.target.value) })}
                onBlur={() => touch('telefone')}
                className={registerTouched.telefone && !telefoneValido ? 'input-error' : ''}
              />
              {registerTouched.telefone && !telefoneValido && (
                <span className="field-error">Telefone inválido</span>
              )}
            </div>

            {/* Senha */}
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={registerForm.senha}
                onChange={(e) => setRegisterForm({ ...registerForm, senha: e.target.value })}
                onBlur={() => touch('senha')}
              />
              {registerForm.senha && (
                <div className="senha-forca">
                  <div className="forca-barras">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="forca-barra"
                        style={{ backgroundColor: n <= forca.nivel ? forca.cor : '#e0e7e9' }}
                      />
                    ))}
                  </div>
                  <span className="forca-label" style={{ color: forca.cor }}>
                    {forca.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="form-group">
              <label>Confirmar senha</label>
              <input
                type="password"
                value={registerForm.confirmaSenha}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmaSenha: e.target.value })}
                onBlur={() => touch('confirmaSenha')}
                className={registerTouched.confirmaSenha && registerForm.confirmaSenha && !senhasIguais ? 'input-error' : ''}
              />
              {registerTouched.confirmaSenha && registerForm.confirmaSenha && !senhasIguais && (
                <span className="field-error">As senhas não coincidem</span>
              )}
            </div>

            {/* Perfil */}
            <div className="form-group">
              <label>Perfil</label>
              <select
                value={registerForm.papel}
                onChange={(e) => setRegisterForm({ ...registerForm, papel: e.target.value })}
              >
                <option value="COLABORADOR">Colaborador</option>
                <option value="PSICOLOGO">Psicólogo</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !formValido}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
