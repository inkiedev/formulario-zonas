export const columns = [
  {name: "ACCIONES", uid: "acciones", minWidth: "min-w-[10rem]"},
  {name: "FORMULARIO", uid: "numero_item", sortable: true},
  {name: "INCIDENTE", uid: "incidente", sortable: true},
  {name: "FECHA", uid: "fecha_creacion", sortable: true, minWidth: "min-w-[10rem]"},
  {name: "ESTADO", uid: "esta_atendido", sortable: true},
  {name: "ASUNTO", uid: "asunto", minWidth: "min-w-[10rem]"},
  {name: "MOTIVO", uid: "motivo", minWidth: "min-w-[10rem]"},
  {name: "TIPO DE DISPOSITIVO", uid: "dispositivo"},
  {name: "DISPOSITIVO", uid: "nombre_dispositivo"},
  {name: "REPORTADO POR", uid: "atencion", minWidth: "min-w-[15rem]"},
  {name: "OPERADOR", uid: "operador", minWidth: "min-w-[10rem]"},
  {name: "SUPERINTENDENTE", uid: "superintendente", minWidth: "min-w-[10rem]"},
  {name: "ALIMENTADOR", uid: "responsables.alimentador", sortable: true},
  {name: "RESPONSABLE", uid: "responsables.responsable", minWidth: "min-w-[12rem]", sortable: true},
  {name: "AUXILIAR", uid: "responsables.auxiliar", minWidth: "min-w-[12rem]"},
  {name: "ZONA RESPONSABLE", uid: "responsables.zona", minWidth: "min-w-[8rem]"},
  {name: "DIRECCION", uid: "direccion", minWidth: "min-w-[15rem]"},
  {name: "OBSERVACIONES", uid: "observaciones", minWidth: "min-w-[15rem]"},
  {name: "ARCHIVO FOTOGRAFICO", uid: "tiene_archivo"},
  {name: "FECHA DE ATENCION", uid: "fecha_atencion", sortable: true},
  {name: "OBSERVACIONES DE ATENCION", uid: "observaciones_atencion", minWidth: "min-w-[15rem]"},
  {name: "PERSONAL QUE ATIENDE", uid: "operador_atencion", minWidth: "min-w-[15rem]"},
  {name: "ZONA", uid: "zona", minWidth: "min-w-[8rem]", sortable: true},
];

export const statusOptions = [
  {name: "Atendido", uid: "atendido"},
  {name: "Despachado", uid: "despachado"},
];

export const zonasOptions = [
  {name: "Zona 1", uid: "Zona 1"},
  {name: "Zona 2", uid: "Zona 2"},
  {name: "Zona 3", uid: "Zona 3"},
  {name: "Zona 10", uid: "Zona 10"},
  {name: "DICO", uid: "DICO"},
];
