import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Order API')
    .setDescription('API for managing orders')
    .setVersion('1.0')
    .addTag('Orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/orders/docs', app, document);

  await app.startAllMicroservices();
  
  await app.listen(3001);
}
bootstrap();
