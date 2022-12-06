export interface AuthState {
  session: Session;
}

export interface Session {
  token: string;
}

export interface Credentials {
  email: string;
  password: string;
}
