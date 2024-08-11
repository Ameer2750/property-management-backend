import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CustomResponseObjectInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // enable cors
  app.enableCors({ origin: true });

  // validation pipe enables
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  // extra security headers
  app.use(helmet());

  // global prefix name http://ip:port/api
  app.setGlobalPrefix('api');

  // custom interceptor
  app.useGlobalInterceptors(new CustomResponseObjectInterceptor());

  // listen 8022
  await app.listen(8022);
  console.log('server is running on port 8022')
}
bootstrap();
