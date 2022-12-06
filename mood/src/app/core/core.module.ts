import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NgxWebstorageModule } from 'ngx-webstorage';

import { AuthInterceptor } from './auth-interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, NgxWebstorageModule.forRoot()],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
