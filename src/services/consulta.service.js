import { apiFetch } from "./api";

export function agendarConsulta(data) {
  return apiFetch("/consultas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listarMinhasConsultas() {
  return apiFetch("/consultas/minhas");
}

export function buscarConsultaPorId(id) {
  return apiFetch(`/consultas/${id}`);
}

export function cancelarConsulta(id) {
  return apiFetch(`/consultas/${id}`, {
    method: "DELETE",
  });
}

export function atualizarStatusConsulta(id, status) {
  return apiFetch(`/consultas/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export const STATUS_CONSULTA = {
  AGENDADA:  "AGENDADA",
  REALIZADA: "REALIZADA",
  CANCELADA: "CANCELADA",
};

export const STATUS_LABELS = {
  AGENDADA:  "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
};
