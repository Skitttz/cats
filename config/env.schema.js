import { z } from 'zod';

function createUrlSchema(mode) {
  return z
    .string()
    .trim()
    .url()
    .refine((url) => mode !== 'production' || url.startsWith('https://'), {
      message: 'use HTTPS in production',
    });
}

function createEnvironmentSchema(mode) {
  const urlSchema = createUrlSchema(mode);

  return z.object({
    VITE_BASE_API_URL: urlSchema,
    VITE_APP_URL: urlSchema,
  });
}

function validateEnvironment(environment, mode) {
  const validation = createEnvironmentSchema(mode).safeParse(environment);

  if (!validation.success) {
    const issues = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment:\n${issues}`);
  }

  return validation.data;
}

export { createEnvironmentSchema, createUrlSchema, validateEnvironment };
