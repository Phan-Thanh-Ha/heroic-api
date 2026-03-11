import { JwtPayloadAdmin, JwtPayloadCustomer } from "src/jwt";

export type SocketUser =
  | (JwtPayloadAdmin & { type: 'admin' })
  | (JwtPayloadCustomer & { id: number; type: 'customer' });
