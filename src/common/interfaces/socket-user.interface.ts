import { JwtPayloadAdmin, JwtPayloadCustomer } from '../../jwt/index';

export type SocketUser =
  | (JwtPayloadAdmin & { type: 'admin' })
  | (JwtPayloadCustomer & { id: number; type: 'customer' });
