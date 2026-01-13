import { JwtPayloadAdmin, JwtPayloadCustomer } from '@jwt';

export type SocketUser =
  | (JwtPayloadAdmin & { type: 'admin' })
  | (JwtPayloadCustomer & { id: number; type: 'customer' });
