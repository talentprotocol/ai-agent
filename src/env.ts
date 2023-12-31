import z from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  PORT: z.coerce.number().optional().default(8080),
  RATE_LIMIT_DURATION: z.coerce.number().optional().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().optional().default(60),
  TP_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
