import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configuration } from "./config";
import { extraModels } from "./extraModels.swagger";

export const initSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(`http://localhost:${configuration().port}`)
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels,
    });
    SwaggerModule.setup('docs', app, document);
}