import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { ContainerComponent } from './components/container.component';
import { ErrorPageComponent } from './components/error-page.component';
import { FormValidationMsgsComponent } from './components/form-validation-msgs.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoadSpinnerComponent } from './components/load-spinner.component';
import { SafePipe } from './common/pipes/safe-html.pipe';

const declarations = [
  ContainerComponent,
  ErrorPageComponent,
  FormValidationMsgsComponent,
  HeaderComponent,
  LayoutComponent,
  LoadSpinnerComponent,
  SafePipe,
];

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    MenuModule,
    ProgressSpinnerModule,
    TooltipModule,
    RippleModule,
  ],
  declarations,
  exports: declarations,
  providers: [],
  entryComponents: [],
})
export class SharedModule {}
