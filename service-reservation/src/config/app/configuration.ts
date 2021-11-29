import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: process.env.PORT,
  httpTimeout: process.env.HTTP_TIMEOUT,
  httpMaxDirect: process.env.HTTP_MAX_REDIRECTS,
  urlGateway: process.env.URL_GATEWAY,
}));
