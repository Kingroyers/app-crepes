import { Component, Input, OnInit } from '@angular/core';
import { IArea, ICiudad, IPdv } from '../../../interfaces/pdv.interface';
import { Categories } from '../../services/jsonsProviders';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: false
})
export class SelectComponent implements OnInit {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() control: FormControl = new FormControl();

  valuekey: string = '';
  labelKey: string = '';

  usable: any[] = [];
  ciudades: ICiudad[] = [];
  pdvsFiltrados: IPdv[] = [];
  areas: IArea[] = [];

  ciudadSeleccionada: string = '';
  mostrarPdvs: boolean = false;

  constructor(private readonly pdvSrv: Categories, private readonly areaSrv: Categories) {}

  ngOnInit() {
    if (this.id === 'pdvs') {
      this.pdvSrv.getPdv().subscribe((data: ICiudad[]) => {
        this.ciudades = data;
      });
    } else {
      this.areaSrv.getDepartment().subscribe((a: IArea[]) => {
        this.areas = a;
        this.usable = this.areas;
        this.valuekey = 'area';
        this.labelKey = 'areaF';
      });
    }
  }

  onCiudadSelect(event: any) {
    const ciudadKey = event.detail.value;
    this.ciudadSeleccionada = ciudadKey;
    const ciudad = this.ciudades.find(c => c.ciudad === ciudadKey);
    this.pdvsFiltrados = ciudad ? ciudad.pdvs : [];
    this.mostrarPdvs = this.pdvsFiltrados.length > 0;
    this.control.setValue(null);
  }

  onPdvSelect(event: any) {
    this.control.setValue(event.detail.value);
  }

  public onSelect(event: any) {
    this.control.setValue(event.detail.value);
  }
}