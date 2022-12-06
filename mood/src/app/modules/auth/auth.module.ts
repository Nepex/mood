import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '@shared';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    AuthRoutingModule,
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModule,
    TooltipModule,
  ],
  declarations: [AuthComponent],
})
export class AuthModule {}
