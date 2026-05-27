export interface IEquipo {
  codigo_barras: string;
  nombre_equipo: string;
  tipo_equipo?: string;
  area_encargada?: string;
  estado?: string;
  fecha_creacion?: string;
  ubicacion_equipo?: string;

  historial_visitas?: IHistorialVisita[];
}

export interface IHistorialVisita {
  id: number;
  codigo_equipo: string;
  fecha_visita: string;
  tipo_visita?: string;
  area_realiza?: string;
  tecnico_nombre?: string;
  observaciones?: string;
  proximo_mantenimiento?: string;
}
