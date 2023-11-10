import z from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  PORT: z.number().optional().default(8080),
  RATE_LIMIT_DURATION: z.number().optional().default(60000),
  RATE_LIMIT_MAX: z.number().optional().default(60),
});

export const env = envSchema.parse(process.env);
