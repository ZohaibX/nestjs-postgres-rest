import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  // we want to enable cors for dev mode only. for prod mode -> we will allow only our own frontend
  // one more thing we need to do with package.json start:dev
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    // app.enableCors({ origin : /* string or array of string */ }) // string will be the endpoint of our frontend website
    logger.log(`Accepting requests from origin "string"`);
  }

  // NODE_ENV
  const serverConfig: { port: number } = config.get('server');

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`App is listening at port ${port}`);
}
bootstrap();
