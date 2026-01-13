import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_SOCKET_KEY } from '../constant';

export const PublicSocket = () => SetMetadata(IS_PUBLIC_SOCKET_KEY, true);
