type Incidente = {
  id: number;
  incidente: string;
  fecha_creacion: string;
  asunto: string;
  motivo: string;
  dispositivo: string;
  nombre_dispositivo: string;
  atencion: string;
  operador: string;
  superintendente: string;
  id_responsable: number;
  responsables: {
    alimentador: string;
    responsable: string;
    auxiliar: string;
    zona: string;
  };
  direccion: string;
  observaciones: string | null;
  tiene_archivo: boolean;
  esta_atendido: boolean;
  fecha_atencion: string | null;
  operador_atencion: string | null;
  observaciones_atencion: string | null;
  zona: string;
  [key: string]: any;
}

export type { Incidente };
