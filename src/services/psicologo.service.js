import { apiFetch } from "./api";

export function listarPsicologos() {
  return apiFetch("/psicologos");
}

export function buscarDisponibilidade(id) {
  return apiFetch(`/psicologos/${id}/disponibilidade`);
}

export function criarDisponibilidade(data) {
  return apiFetch("/psicologos/disponibilidade", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function removerDisponibilidade(id) {
  return apiFetch(`/psicologos/disponibilidade/${id}`, {
    method: "DELETE",
  });
}

export const DIA_SEMANA = {
  SEGUNDA: "SEGUNDA",
  TERCA:   "TERCA",
  QUARTA:  "QUARTA",
  QUINTA:  "QUINTA",
  SEXTA:   "SEXTA",
  SABADO:  "SABADO",
  DOMINGO: "DOMINGO",
};

export const DIA_SEMANA_LABELS = {
  SEGUNDA: "Segunda-feira",
  TERCA:   "Terça-feira",
  QUARTA:  "Quarta-feira",
  QUINTA:  "Quinta-feira",
  SEXTA:   "Sexta-feira",
  SABADO:  "Sábado",
  DOMINGO: "Domingo",
};
