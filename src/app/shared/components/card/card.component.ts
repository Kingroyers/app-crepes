import { Component, OnInit } from '@angular/core';
import { Categories } from '../../services/jsonsProviders';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false
})

  //Inspirate, Cargar modelo propio, Tutorial para usar app, desafios 3d

export class CardComponent  implements OnInit {

cards: { icon: string, title: string, description: string, direction: string }[] = [];

  constructor(private readonly jsonSrv: Categories) { }

  ngOnInit() {
    this.jsonSrv.getCartContent().subscribe(message =>{
      this.cards = message;
    })
  }

}
