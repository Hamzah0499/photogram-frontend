import { z } from 'zod/v4';

export const axiosResponseSchema = z.object({
  isSuccess: z.boolean(),
  statusCode: z.number(),
  error: z.object({
    name: z.string(),
    message: z.string(),
    stack: z.string().optional(),
  }),
  data: z.any(),
});

export type AxiosResponseType = z.infer<typeof axiosResponseSchema>;
