import { Component } from '@angular/core';

import { AuthService, Credentials } from '@core';
import { BaseControllerService, FormController, Logger } from '@shared';

const logger = new Logger('CalendarComponent');

@Component({
  selector: 'mood-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends FormController<Credentials> {
  constructor(
    public baseService: BaseControllerService,
    private readonly authService: AuthService
  ) {
    super(baseService);
  }
}
