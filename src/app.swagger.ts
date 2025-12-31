import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ADMIN_TAG_LIST, CUSTOMER_TAG_LIST } from "./common/apis-routes/api.routes";
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

    // 1. CẤU HÌNH BUILDER
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0.0')
        // --- SỬA Ở ĐÂY: Dùng Bearer Auth thay cho ApiKey ---
        .addApiKey(
            {
                type: 'apiKey', 
                name: 'x-access-token', // Tên Header sẽ xuất hiện trong curl
                in: 'header',
                description: 'Nhập token vào đây (không cần chữ Bearer)',
            },
            'JWT', // 👈 Key định danh (Reference Key)
        )
        // --- Giữ nguyên Global Parameters ---
        .addGlobalParameters({
            in: 'header',
            required: false,
            name: 'x-language',
            schema: {
                type: 'string',
                example: 'vi',
                default: 'vi',
                description: 'Ngôn ngữ phản hồi (vi, en, cn)',
            },
        })
        .addGlobalParameters({
            in: 'header',
            required: false,
            name: 'x-time-zone',
            schema: {
                type: 'string',
                example: 'Asia/Ho_Chi_Minh',
                default: 'Asia/Ho_Chi_Minh',
                description: 'Múi giờ của Client',
            },
        });

    const baseDocument = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
            operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        },
    );

    const swaggerConfigs: SwaggerConfig[] = [
        {
            title: 'Heroic API - Admin',
            description: 'Heroic API Documentation for Admin',
            path: 'docs-admin',
            includeTags: ADMIN_TAG_LIST,
        },
        {
            title: 'Heroic API - Customer',
            description: 'Heroic API Documentation for Customer',
            path: 'docs-customer',
            includeTags: CUSTOMER_TAG_LIST,
        },
    ];

    const explorerUrls: any[] = [];

    swaggerConfigs.forEach((config) => {
        const document = createSwaggerDocument(baseDocument, config);

        SwaggerModule.setup(config.path, app, document, {
            customSiteTitle: `${config.title} Documentation`,
            swaggerOptions: {
                // Giúp lưu trạng thái login khi chuyển đổi giữa các docs
                persistAuthorization: true,
                requestInterceptor: (req: any) => {
                    if (!req.headers) req.headers = {};
                    req.headers['ngrok-skip-browser-warning'] = 'true';
                    return req;
                },
            },
        });

        explorerUrls.push({
            name: config.path,
            url: `/${config.path}-json`,
        });
    });

    // --- TẠO TRANG TỔNG HỢP (HUB) ---
    SwaggerModule.setup('docs', app, baseDocument, {
        explorer: true,
        customSiteTitle: 'Heroic API Hub',
        swaggerOptions: {
            urls: explorerUrls,
            'urls.primaryName': explorerUrls[0].name,
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            docExpansion: 'list',
            theme: 'monokai',
            tryItOutEnabled: true,
            tagsSorter: 'alpha',
            defaultModelsExpandDepth: -1,
            deepLinking: true,
        },
        customCss: `
            .swagger-ui .wrapper { max-width: 1460px; padding: 0 20px; }
            .swagger-ui .topbar { background-color: #000; border-bottom: 3px solid #ed1c24; }
            .swagger-ui .info .title { color: #ed1c24; font-family: 'Segoe UI', sans-serif; }
            .opblock-summary-path { font-weight: bold !important; }
        `
    });
};