import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false
})
export class InputComponent {

  @Input() type: string = '';
  @Input() label: string = '';
  @Input() placeholder = '';
  @Input() control!: FormControl;

  @Input() isReadonly: boolean = false;

  public onType(event: any){
    this.control.setValue(event.target.value);
  }
}
