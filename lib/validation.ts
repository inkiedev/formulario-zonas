import { z } from "zod"

export const incidentSchema = z.object({
  incidente: z.string()
    .min(2, "El número de incidente debe tener al menos 2 caracteres")
    .max(10, "El número de incidente debe tener como máximo 10 caracteres"),
  zona: z.string().min(1, "La zona es obligatoria"),
  asunto: z.string().min(1, "El asunto es obligatorio"),
  motivo: z.string().min(1, "El motivo es obligatorio"),
  dispositivo: z.string().min(1, "El dispositivo es obligatorio"),
  nombre_dispositivo: z.string().min(1, "El nombre del dispositivo es obligatorio"),
  atencion: z.string().min(1, "La atención es obligatoria"),
  operador: z.string().min(1, "El operador es obligatorio"),
  superintendente: z.string().min(1, "El superintendente es obligatorio"),
  id_responsable: z.number().min(1, "El responsable es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  observaciones: z.string().optional().nullable(),
  tiene_archivo: z.boolean(),
});

export const editarSchema = z.object({
  incidente: z.string()
    .min(2, "El número de incidente debe tener al menos 2 caracteres")
    .max(10, "El número de incidente debe tener como máximo 10 caracteres"),
  nombre_dispositivo: z.string().min(1, "El nombre del dispositivo es obligatorio"),
  observaciones: z.string().optional().nullable(),
  atencion: z.string().optional(),
  operador: z.string().optional(),
  superintendente: z.string().optional(),
});

export const atencionSchema = z.object({
  esta_atendido: z.boolean(),
  fecha_atencion: z.string(),
  observaciones_atencion: z.string().optional().nullable(),
  operador_atencion: z.string()
})
