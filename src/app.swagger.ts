import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ROUTER_TAG_ENUM, SWAGGER_TAG_ENUM } from "./common/enums";
import { filterDocumentByTags } from "./common/swagger";
import { configuration } from "./config";

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
    const ngrokUrl = config.ngrokUrl;

    // Tạo base document
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth();
    
    // Không set cứng localhost ở đây để Swagger UI tự dùng origin hiện tại (window.location)
    // => Khi bạn mở bằng http://192.168.x.x:3103 thì Try it out sẽ gọi đúng IP đó, không bị fix localhost.
    
    const baseDocument = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
            operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        },
    );

    // Cấu hình Swagger cho từng module
    const swaggerConfigs: SwaggerConfig[] = [
        {
            title: 'Heroic API - Admin',
            description: 'Heroic API Documentation for Admin',
            path: 'docs-admin',
            includeTags: [
                ROUTER_TAG_ENUM.AUTH.ADMIN.REGISTER, // 'Register_Admin'
            ],
        },
        {
            title: 'Heroic API - Customer',
            description: 'Heroic API Documentation for Customer',
            path: 'docs-customer',
            includeTags: [
                ROUTER_TAG_ENUM.LOCATIONS.PROVINCE,
                ROUTER_TAG_ENUM.LOCATIONS.DISTRICTS,
                ROUTER_TAG_ENUM.LOCATIONS.WARDS,
                ROUTER_TAG_ENUM.AUTH.CUSTOMER.REGISTER,
                ROUTER_TAG_ENUM.AUTH.CUSTOMER.LOGIN,
                ROUTER_TAG_ENUM.AUTH.CUSTOMER.LOGIN_FACEBOOK,
                ROUTER_TAG_ENUM.AUTH.CUSTOMER.LOGIN_GOOGLE,
                ROUTER_TAG_ENUM.UPLOAD.IMAGE,
                'test'
                // ROUTER_TAG_ENUM.CUSTOMERS.LISTCUSTOMER,
            ],
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