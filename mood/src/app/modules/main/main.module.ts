import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '@shared';
import { MainRoutingModule } from './main-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MainRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TooltipModule,
  ],
  declarations: [MainComponent, CalendarComponent],
})
export class MainModule {}
