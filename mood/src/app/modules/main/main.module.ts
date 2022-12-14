import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '@shared';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';

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
  declarations: [MainComponent],
})
export class MainModule {}
