import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RouteConfig } from '../apis-routes/api.routes';

export function AppController(config: RouteConfig) {
    return applyDecorators(
        Controller(config.path),
        ApiTags(config.tag)
    );
}