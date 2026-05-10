import { apiFetch } from "./api";

export function realizarCheckin(data) {
  return apiFetch("/checkin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listarMeusCheckins() {
  return apiFetch("/checkin/meus");
}

export function buscarCheckinPorId(id) {
  return apiFetch(`/checkin/${id}`);
}
 
export function buscarAnaliseCheckin(id) {
  return apiFetch(`/checkin/${id}/analise`);
}

export const HUMOR_TIPOS = {
  OTIMO:   "OTIMO",
  BOM:     "BOM",
  NEUTRO:  "NEUTRO",
  RUIM:    "RUIM",
  PESSIMO: "PESSIMO",
};

export const HUMOR_LABELS = {
  OTIMO:   "Ótimo 😄",
  BOM:     "Bom 🙂",
  NEUTRO:  "Neutro 😐",
  RUIM:    "Ruim 😔",
  PESSIMO: "Péssimo 😞",
};