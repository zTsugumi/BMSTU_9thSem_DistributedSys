import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  url: process.env.DATABASE_URL,
}));
