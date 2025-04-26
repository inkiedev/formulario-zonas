type IncidenteDTO = {
  incidente: string;
  zona: string;
  asunto: string;
  motivo: string;
  dispositivo: string;
  nombre_dispositivo: string;
  atencion: string;
  operador: string;
  superintendente: string;
  id_responsable: number;
  direccion: string;
  observaciones: string | null;
  tiene_archivo: boolean;
}

export type { IncidenteDTO };
