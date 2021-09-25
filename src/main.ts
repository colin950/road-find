import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      transform: true, // 요청에서 넘어온 자료들의 형변환
    }),
  );

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('port');
  await app.listen(port);
  console.log(`🚀 Application launched at http://127.0.0.1:${port}`);
}
bootstrap();
