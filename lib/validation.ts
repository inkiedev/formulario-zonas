import { z } from "zod"

export const incidentSchema = z.object({
  incidente: z.string().length(10, "El número de incidente debe tener 10 dígitos"),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), "Fecha inválida"),
  operador: z.string(),
  motivo: z.string(),
  direccion: z.string(),
  observaciones: z.string().optional(),
});

export function validateIncident(data: never) {
  return incidentSchema.parse(data);
}
