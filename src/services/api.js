const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'mentis_token';

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Perfil local — campos não suportados pelo backend (CPF, telefone, dataNascimento, genero)
const perfilKey = (userId) => `mentis_perfil_${userId}`;
export const savePerfilLocal = (userId, data) =>
  localStorage.setItem(perfilKey(userId), JSON.stringify(data));
export const getPerfilLocal = (userId) => {
  try { return JSON.parse(localStorage.getItem(perfilKey(userId))) || {}; }
  catch { return {}; }
};

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = body?.mensagem || body?.message || 'Erro inesperado';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }
  return body;
}

// Auth
export const login = (email, senha) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });

export const register = (nome, email, senha, papel) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ nome, email, senha, papel }) });

export const getMe = () => request('/auth/me');

export const updateMe = (data) =>
  request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });

// Check-in
export const createCheckin = (humor, nivelEstresse) =>
  request('/checkin', { method: 'POST', body: JSON.stringify({ humor, nivelEstresse }) });

export const getCheckinAnalise = (id) => request(`/checkin/${id}/analise`);

// Psicólogos
export const listPsicologos = () => request('/psicologos');

export const getPsicologoDisponibilidade = (id) =>
  request(`/psicologos/${id}/disponibilidade`);

// Consultas
export const agendarConsulta = (data) =>
  request('/consultas', { method: 'POST', body: JSON.stringify(data) });
