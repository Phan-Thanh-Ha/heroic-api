import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { configuration } from "./config";
import { extraModels } from "./extraModels.swagger";
import { filterDocumentByTags } from "./common/swagger";
import { SWAGGER_TAG_ENUM } from "./common/enums";

interface SwaggerConfig {
    title: string;
    description: string;
    path: string;
    includeTags?: string[];
    excludeTags?: string[];
}

const createSwaggerDocument = (
    baseDocument: OpenAPIObject,
    config: SwaggerConfig,
): OpenAPIObject => {
    const document = filterDocumentByTags(
        baseDocument,
        config.includeTags,
        config.excludeTags,
    );
    document.info.title = config.title;
    document.info.description = config.description;
    return document;
};

export const initSwagger = (app: INestApplication) => {
    const config = configuration();
    const localUrl = `http://localhost:${config.port}`;
    const ngrokUrl = config.ngrokUrl;
    
    // Sử dụng ngrok URL nếu có, nếu không dùng localhost
    const baseUrl = ngrokUrl || localUrl;
    const servers = ngrokUrl ? [ngrokUrl, localUrl] : [localUrl];

    // Tạo base document
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth();
    
    // Thêm tất cả servers
    servers.forEach(server => {
        documentBuilder.addServer(server);
    });
    
    const baseDocument = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
        extraModels,
            operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        },
    );

    // Cấu hình Swagger cho từng module
    const swaggerConfigs: SwaggerConfig[] = [
        {
            title: 'Heroic API - Admin',
            description: 'Heroic API Documentation for Admin',
            path: 'docs-admin',
            includeTags: [SWAGGER_TAG_ENUM.ADMIN],
        },
        {
            title: 'Heroic API - Customer',
            description: 'Heroic API Documentation for Customer',
            path: 'docs-customer',
            includeTags: [SWAGGER_TAG_ENUM.CUSTOMER],
        },
    ];

    // Setup Swagger UI cho từng module
    swaggerConfigs.forEach((config) => {
        const document = createSwaggerDocument(baseDocument, config);
        SwaggerModule.setup(config.path, app, document, {
            customSiteTitle: `${config.title} Documentation`,
            swaggerOptions: {
                // Tự động thêm header vào tất cả requests từ Swagger UI
                requestInterceptor: (req: any) => {
                    if (!req.headers) req.headers = {};
                    req.headers['ngrok-skip-browser-warning'] = 'true';
                    return req;
                },
            },
        });
    });
};