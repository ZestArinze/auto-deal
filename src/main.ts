import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // basic security config
  app.use(helmet());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    console.log(' ************** server up *************** ');
  });
}

bootstrap();
