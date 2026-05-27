import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChipComponent } from './components/chip/chip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  register as registerSwiperElement
} from 'swiper/element/bundle';
import { TextsComponent } from './components/texts/texts.component';
import { CardComponent } from './components/card/card.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/input/input.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { SelectComponent } from './components/select/select.component';
import { DateComponent } from './components/date/date.component';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateEventModalComponent } from './components/create-event-modal/create-event-modal.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { OptionsPopoverComponent } from './components/options-popover/options-popover.component';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
import { DetailModalComponent } from './components/detail-modal/detail-modal.component';
import { NotificationsModalComponent } from './components/notifications-modal/notifications-modal.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

registerLocaleData(localeEsCo);
registerSwiperElement();

const components = [
  HeaderComponent,
  ChipComponent,
  TextsComponent,
  CardComponent,
  SideMenuComponent,
  ModalComponent,
  InputComponent,
  TextAreaComponent,
  SelectComponent,
  DateComponent,
  OptionsPopoverComponent,
  DetailModalComponent
];

const modules = [
  IonicModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  ZXingScannerModule

];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ...components,
    CalendarComponent,
    CreateEventModalComponent,
    ProfileModalComponent,
    ProfilePopoverComponent,
    NotificationsModalComponent,
  ],
  imports: [
    CommonModule,
    ...modules,
    FullCalendarModule,

  ],
  exports: [
    CommonModule,
    ...components,
    ...modules,
    CalendarComponent,
    CreateEventModalComponent,
    ProfileModalComponent,
    ProfilePopoverComponent,
    NotificationsModalComponent,
  ]
})
export class SharedModule { }
