import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventModule } from './event.module';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);
  const config = new DocumentBuilder()
    .setTitle('Event API')
    .setDescription('API for managing events')
    .setVersion('1.0')
    .addTag('Events')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/events/docs', app, document);
  
  await app.listen(3000);
}
bootstrap();
