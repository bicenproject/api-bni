import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';  
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());  
  app.enableCors({  
    origin: 'http://192.168.1.4:3000',  
    credentials: true,  
  });
  await app.listen(8000);
}
bootstrap();
