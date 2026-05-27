import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: false
})
export class DateComponent  implements OnInit {
@Input() datetime: string = '';


  constructor() { }

  ngOnInit() {}

}
