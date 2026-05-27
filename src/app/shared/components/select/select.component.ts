import { Component, Input, OnInit } from '@angular/core';
import { IArea, IPdv } from '../../../interfaces/pdv.interface';
import { Categories } from '../../services/jsonsProviders';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone:false
})
export class SelectComponent  implements OnInit {
@Input() label: string = '';
@Input() id: string = '';
@Input() control: FormControl = new FormControl();

valuekey: string = '';
labelKey: string = '';

usable: any[] = [];

 pdvs: IPdv[] = [];
areas: IArea[] = [];

  constructor(private readonly pdvSrv: Categories, private readonly areaSrv: Categories) { }

   ngOnInit() {

    //  this.areaSrv.getDepartment().subscribe(a =>{
    //   this.areas = a;
    // })

    // this.pdvSrv.getPdv().subscribe(p => {
    //    this.pdvs = p;


    // })

    if (this.id === 'pdvs') {

       this.pdvSrv.getPdv().subscribe(p => {
       this.pdvs = p;

       this.usable = this.pdvs

       this.valuekey = 'pdv';
       this.labelKey = 'pdvF';
    });

    } else {

     this.areaSrv.getDepartment().subscribe(a =>{
      this.areas = a;

      this.usable = this.areas;

      this.valuekey = 'area';
      this.labelKey = 'areaF';
    });
    }

  }


public onSelect(event: any){
this.control.setValue(event.detail.value);
}


}
