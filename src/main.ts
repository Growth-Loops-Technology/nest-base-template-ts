import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // Update with the origin(s) of your Swagger UI
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // HTTP methods to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers to allow
    credentials: true, // Allow cookies/credentials if needed
  });
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('The Auth API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));
  await app.listen(3000);
}
bootstrap();
