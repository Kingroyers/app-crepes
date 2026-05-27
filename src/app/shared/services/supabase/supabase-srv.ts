import { Injectable } from '@angular/core';
import { supabase } from '../../../database/supabase';

@Injectable({
  providedIn: 'root',
})
export class SupabaseSrv {

  async getEquipoCompleto(code: string) {
    const { data, error } = await supabase
      .from('equipos')
      .select(`
        *,
        historial_visitas (*)
      `)
      .eq('codigo_barras', code)
      .order('fecha_visita', { foreignTable: 'historial_visitas', ascending: false })
      .limit(1, { foreignTable: 'historial_visitas' })
      .single();

    if (error) {
      console.error('Error al obtener equipo:', error);
      return null;
    }

    return data;
  }

  async registrarMantenimiento(nuevaVisita: any) {
    const { data, error } = await supabase
      .from('historial_visitas')
      .insert([nuevaVisita]);

    if (error) {
      console.error('Error al registrar visitas:', error);
      throw error;
    }
    return data;
  }

  /**
   * Guarda una nueva visita en historial_visitas.
   * El objeto `visita` debe incluir: codigo_equipo, fecha_visita, tipo_visita,
   * area_realiza, tecnico_nombre, observaciones, proximo_mantenimiento.
   */
  async guardarVisita(visita: {
    codigo_equipo: string;
    fecha_visita: string;
    tipo_visita: string;
    area_realiza: string;
    tecnico_nombre: string;
    observaciones: string;
    proximo_mantenimiento: string;
  }) {
    const { data, error } = await supabase
      .from('historial_visitas')
      .insert([visita])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar visita:', error);
      throw error;
    }
    return data;
  }

  /**
   * Obtiene todo el historial de visitas de un equipo,
   * ordenado de más reciente a más antiguo.
   */
  async getHistorialCompleto(codigoEquipo: string) {
    const { data, error } = await supabase
      .from('historial_visitas')
      .select('*')
      .eq('codigo_equipo', codigoEquipo)
      .order('fecha_visita', { ascending: false });

    if (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
    return data ?? [];
  }
}
