export interface UserPayload {
  email: string;
  confirmed: boolean;
  active: boolean;
  createdAt: Date;
}

declare global {
  namespace Express {
    export interface Request {
      user: UserPayload;
    }
  }
}
