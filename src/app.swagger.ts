import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initSwagger = (app: INestApplication) => {
    // Tạo document với tất cả tags - tự động detect từ controllers
    const documentBuilder = new DocumentBuilder()
        .setTitle('Heroic API')
        .setDescription('Heroic API Documentation - Sử dụng dropdown ở trên để chọn section')
        .setVersion('1.0.0')
        .addBearerAuth();
    
    const document = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
            operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
        },
    );

    // Setup Swagger UI duy nhất với tất cả tags
    // Dropdown sẽ tự động filter tags dựa trên các tags có sẵn trong document
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Heroic API Documentation',
        customJs: [
            '/public/swagger-section-selector.js',
        ],
        swaggerOptions: {
            // Tự động thêm header vào tất cả requests từ Swagger UI
            requestInterceptor: (req: any) => {
                if (!req.headers) req.headers = {};
                req.headers['ngrok-skip-browser-warning'] = 'true';
                return req;
            },
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
        },
    });
};