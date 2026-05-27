import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEquipo, IHistorialVisita } from 'src/app/interfaces/equipos.interface';
import { SupabaseSrv } from 'src/app/shared/services/supabase/supabase-srv';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.page.html',
  styleUrls: ['./equipment-detail.page.scss'],
  standalone: false
})
export class EquipmentDetailPage implements OnInit {

  equipo!: IEquipo;
  historial: IHistorialVisita[] = [];
  isLoading = true;

  data!: {
    equipo: IEquipo;
    historial: IHistorialVisita;
    userName: string;
    userDepartment: string;
    fecha: string;
  };

  constructor(
    private readonly router: Router,
    private readonly supabaseSrv: SupabaseSrv
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.data = navigation.extras.state['data'];
      this.equipo = this.data.equipo;
    }
  }

  async ngOnInit() {
    if (this.equipo?.codigo_barras) {
      this.historial = await this.supabaseSrv.getHistorialCompleto(this.equipo.codigo_barras);
    }
    this.isLoading = false;
  }

  getTipoClass(tipo: string | undefined): string {
    if (!tipo) return '';
    switch (tipo.toLowerCase()) {
      case 'correctivo': return 'correctivo';
      case 'preventivo': return 'preventivo';
      case 'predictivo': return 'predictivo';
      default: return 'otro';
    }
  }

  getTipoIcon(tipo: string | undefined): string {
    switch (tipo?.toLowerCase()) {
      case 'correctivo':  return 'alert-circle-outline';
      case 'preventivo':  return 'shield-checkmark-outline';
      case 'predictivo':  return 'analytics-outline';
      case 'instalación': return 'build-outline';
      case 'inspección':  return 'eye-outline';
      default:            return 'construct-outline';
    }
  }
}
