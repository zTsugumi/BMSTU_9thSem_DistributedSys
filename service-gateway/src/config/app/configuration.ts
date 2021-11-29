import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: process.env.PORT,
  httpTimeout: process.env.HTTP_TIMEOUT,
  httpMaxDirect: process.env.HTTP_MAX_REDIRECTS,
  urlLoyalty: process.env.URL_LOYALTY,
  urlHotels: process.env.URL_HOTELS,
  urlReservations: process.env.URL_RESERVATIONS,
  urlPayments: process.env.URL_PAYMENTS,
  urlMe: process.env.URL_ME,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
