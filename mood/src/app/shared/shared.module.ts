import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { ContainerComponent } from './components/container/container.component';
import { ErrorPageComponent } from './components/error-page.component';
import { FormValidationMsgsComponent } from './components/form-validation-msgs.component';
import { PageLoaderComponent } from './components/page-loader.component';

import { OffClickDirective } from './common/directives/off-click.directive';

const declarations = [
  ContainerComponent,
  ErrorPageComponent,
  FormValidationMsgsComponent,
  OffClickDirective,
  PageLoaderComponent,
];

@NgModule({
  declarations,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  exports: declarations,
  providers: [],
  entryComponents: [],
})
export class SharedModule {}
