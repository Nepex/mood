import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { ContainerComponent } from './components/layout/container/container.component';
import { ErrorPageComponent } from './components/error-page.component';
import { FormValidationMsgsComponent } from './components/form-validation-msgs.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { PageLoaderComponent } from './components/page-loader.component';

const declarations = [
  ContainerComponent,
  ErrorPageComponent,
  FormValidationMsgsComponent,
  LayoutComponent,
  HeaderComponent,
  PageLoaderComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  declarations,
  exports: declarations,
  providers: [],
  entryComponents: [],
})
export class SharedModule {}
