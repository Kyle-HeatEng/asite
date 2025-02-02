import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './statistic.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Statistic API')
    .setDescription('API for managing static')
    .setVersion('1.0')
    .addTag('Statistic')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/statistic/docs', app, document);
  
  await app.listen(3004);
}
bootstrap();
