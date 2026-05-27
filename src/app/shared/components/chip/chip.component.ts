import { Component, OnInit } from '@angular/core';
import { Categories } from '../../services/jsonsProviders';
import { ICategory } from 'src/app/interfaces/category.interface';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  standalone: false
})
export class ChipComponent  implements OnInit {
  catergories: ICategory[] = []
  constructor(private readonly categoriesSrv: Categories) { }



  ngOnInit() {
    this.categoriesSrv.getCategories().subscribe(c =>{
      this.catergories = c
    });
  };



}
