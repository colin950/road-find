import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './util/interceptors/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX, DOC_PATH } from './constants';
import { CommonResponseInterceptor } from './util/interceptors/common.response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      // forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      transform: true, // 요청에서 넘어온 자료들의 형변환
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CommonResponseInterceptor());

  app.setGlobalPrefix(API_PREFIX);

  const swagger = new DocumentBuilder()
    .setTitle('나들길 API')
    .setDescription('나들길 서비스 API 문서입니다.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(DOC_PATH, app, document);

  const config = app.get<ConfigService>(ConfigService);
  console.log(config.get('port'));
  const port = config.get('port');
  await app.listen(port);
  console.log(`🚀 Application launched at http://127.0.0.1:${port}`);
}
bootstrap();
