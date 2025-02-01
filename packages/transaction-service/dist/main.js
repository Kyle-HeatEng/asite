"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const transaction_module_1 = require("./transaction.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(transaction_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Transaction API')
        .setDescription('API for managing transactions')
        .setVersion('1.0')
        .addTag('Transactions')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URI],
            queue: 'orders_queue',
        },
    });
    await app.startAllMicroservices();
    await app.listen(3002);
}
bootstrap();
//# sourceMappingURL=main.js.map