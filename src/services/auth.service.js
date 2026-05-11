import { apiFetch } from "./api";

export function register(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return apiFetch("/auth/me");
}

export function atualizarPerfil(data) {
  return apiFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function salvarSessao(authResponse) {
  localStorage.setItem("token", authResponse.token);
  localStorage.setItem("papel", authResponse.papel);
  localStorage.setItem("nome", authResponse.nome);
  localStorage.setItem("usuarioId", authResponse.usuarioId);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("papel");
  localStorage.removeItem("nome");
  localStorage.removeItem("usuarioId");
}

export function getPapel() {
  return localStorage.getItem("papel");
}

export function isAutenticado() {
  return Boolean(localStorage.getItem("token"));
}
