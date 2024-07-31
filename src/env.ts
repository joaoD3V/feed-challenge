import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().default('https://jsonplaceholder.typicode.com'),
});

export const env = envSchema.parse(import.meta.env);
