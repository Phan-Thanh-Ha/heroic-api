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
    // const ngrokUrl = config.ngrokUrl; // Có thể dùng nếu cần set Server URL cụ thể

    // 1. Tạo base document (chứa tất cả các định nghĩa)
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth();
    
    const baseDocument = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
            operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        },
    );

    // 2. Cấu hình các phân đoạn (Modules) Swagger
    const swaggerConfigs: SwaggerConfig[] = [
        {
            title: 'Heroic API - Admin',
            description: 'Heroic API Documentation for Admin',
            path: 'docs-admin',
            includeTags: [
                ROUTER_TAG_ENUM.AUTH.ADMIN.REGISTER,
                // ROUTER_TAG_ENUM.AUTH.ADMIN.LOGIN,
                // ROUTER_TAG_ENUM.AUTH.ADMIN.EMPLOYEES,
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
                ROUTER_TAG_ENUM.CUSTOMERS.LISTCUSTOMER,
            ],
        },
    ];

    // 3. Khởi tạo Swagger UI cho từng cấu hình
    swaggerConfigs.forEach((config) => {
        const document = createSwaggerDocument(baseDocument, config);
        
        SwaggerModule.setup(config.path, app, document, {
            customSiteTitle: `${config.title} Documentation`, // Đã thêm dấu huyền (backticks)
            swaggerOptions: {
                // Tự động thêm header để tránh trang cảnh báo của ngrok nếu đang dùng tunnel
                requestInterceptor: (req: any) => {
                    if (!req.headers) req.headers = {};
                    req.headers['ngrok-skip-browser-warning'] = 'true';
                    return req;
                },
                persistAuthorization: true, // Giữ token khi reload trang
            },
        });
    });
};