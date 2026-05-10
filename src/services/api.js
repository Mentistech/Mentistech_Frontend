const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const mensagem =
      Array.isArray(data?.message)
        ? data.message.join(", ")   // erros de validação do class-validator
        : data?.message || "Erro na requisição";
    const err = new Error(mensagem);
    err.statusCode = data?.statusCode || res.status;
    throw err;
  }

  return data;
}
