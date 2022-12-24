import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '@shared';
import { MainRoutingModule } from './main-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { MainComponent } from './main.component';
import { ManageJournalEntryComponent } from './manage-journal-entry/manage-journal-entry.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MainRoutingModule,
    ReactiveFormsModule,
    RippleModule,
    SharedModule,
    TooltipModule,
  ],
  declarations: [MainComponent, CalendarComponent, ManageJournalEntryComponent],
})
export class MainModule {}
