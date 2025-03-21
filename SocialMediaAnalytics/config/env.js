const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("3000"),

  API_BASE_URL: z.string().url(),
  API_TOKEN: z.string().min(1),

  CACHE_TTL: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("300000"),
});

try {
  const env = envSchema.parse(process.env);

  module.exports = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    API_BASE_URL: env.API_BASE_URL,
    API_TOKEN: env.API_TOKEN,
    CACHE_TTL: env.CACHE_TTL,
    IS_PRODUCTION: env.NODE_ENV === "production",
    IS_DEV: env.NODE_ENV === "development",
    IS_TEST: env.NODE_ENV === "test",
  };
} catch (error) {
  console.error("\nEnvironment validation failed:");
  console.error(error.format());
  process.exit(1);
}
