import { ZodSchema } from 'zod';

export const zodFormikValidate =
  <T>(schema: ZodSchema<T>) =>
    (values: T) => {
      const result = schema.safeParse(values);

      if (result.success) return {};

      const errors: Record<string, string> = {};

      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field && !errors[field]) {
          errors[field] = err.message;
        }
      });

      return errors;
    };
