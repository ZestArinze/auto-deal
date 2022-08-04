import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // basic security config
  app.use(helmet());
  app.enableCors();

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    console.log(' ************** server up *************** ');
  });
}

bootstrap();
