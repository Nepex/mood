export class Session {
  token: string;

  constructor(model?: Partial<Session>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}

export interface Credentials {
  email: string;
  password: string;
}
