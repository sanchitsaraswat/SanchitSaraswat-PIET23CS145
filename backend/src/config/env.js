import 'dotenv/config';
const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) if (!process.env[key] && process.env.NODE_ENV !== 'test') throw new Error(`Missing environment variable: ${key}`);
export const env = {
  port: Number(process.env.PORT || 4000), nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL, frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'test-access-secret-which-is-long-enough',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-which-is-long-enough',
  accessTtl: process.env.ACCESS_TOKEN_TTL || '15m', refreshDays: Number(process.env.REFRESH_TOKEN_DAYS || 30)
};
