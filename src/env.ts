import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // DATABASE_URL: z.string(),
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

const envServer = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  // DATABASE_URL: process.env.DATABASE_URL,
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const env = envServer.data;
