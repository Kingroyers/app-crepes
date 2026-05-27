import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  standalone: false
})
export class TextAreaComponent  implements OnInit {
@Input() type: string = '';
@Input() label: string = '';

@Input() control: FormControl = new FormControl();
  constructor() { }

  ngOnInit() {}

 onType(event: any){
    this.control.setValue(event.target.value);
  }

}
