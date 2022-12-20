import { Component, OnInit } from '@angular/core';

import { Logger } from '@shared';

const logger = new Logger('AuthComponent');

@Component({
  selector: 'mood-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    logger.success('Loaded AuthModule');
  }
}
