import { filterDocumentByTags } from './src/common/swagger/filter-document';
import { ADMIN_TAG_LIST, CUSTOMER_TAG_LIST } from './src/common/apis-routes/api.routes';
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

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
    // const ngrokUrl = process.env.NGROK_URL;

    // 1. CẤU HÌNH BUILDER (Đã thêm Global Parameters)
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        // --- THÊM MỚI: Header Language ---
        .addGlobalParameters({
            in: 'header',
            required: false, // false để backend tự fallback về default nếu không gửi
            name: 'x-language',
            schema: {
                type: 'string',
                example: 'vi',
                default: 'vi',
                description: 'Ngôn ngữ phản hồi (vi, en, cn)',
            },
        })
        // --- THÊM MỚI: Header TimeZone ---
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
    
    // 2. Tạo Base Document (Chứa tất cả API + Header Config ở trên)
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

    // Tạo mảng để hứng các URL JSON cho thanh Select
    const explorerUrls: any[] = [];

    swaggerConfigs.forEach((config) => {
        // Lọc document con từ baseDocument (Header x-language sẽ được kế thừa)
        const document = createSwaggerDocument(baseDocument, config);
        
        // 1. Setup các trang con (để NestJS sinh ra file JSON ngầm)
        SwaggerModule.setup(config.path, app, document, {
            customSiteTitle: `${config.title} Documentation`,
            swaggerOptions: {
                requestInterceptor: (req: any) => {
                    if (!req.headers) req.headers = {};
                    req.headers['ngrok-skip-browser-warning'] = 'true';
                    return req;
                },
            },
        });

        // 2. Thu thập đường dẫn JSON vào mảng explorer
        explorerUrls.push({
            name: config.path, // Tên hiển thị trong Dropdown
            url: `/${config.path}-json`,
        });
    });

    // --- TẠO TRANG TỔNG HỢP (HUB) ---
    SwaggerModule.setup('docs', app, baseDocument, {
        explorer: true, // Bật thanh Select
        customSiteTitle: 'Heroic API Hub',
        swaggerOptions: {
            urls: explorerUrls,
            'urls.primaryName': explorerUrls[0].name,
            persistAuthorization: true,//
            displayRequestDuration: true,
            filter: true,
            docExpansion: 'list',// Bật thanh Select
            theme: 'monokai',
            tryItOutEnabled: true, // Bật try it out 
            tagsSorter: 'alpha', // Sắp xếp tags theo alphabet
            defaultModelsExpandDepth: -1,  // Ẩn bảng danh sách Schemas ở dưới cùng (cho gọn trang)
            deepLinking: true,
        },
    });
};