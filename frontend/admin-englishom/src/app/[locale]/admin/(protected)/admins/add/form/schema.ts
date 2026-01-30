import { z } from 'zod';

export const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().min(5).email(),
  password: z.string().min(8).max(16),
  adminRole: z.enum(['super', 'manager', 'operator', 'view']),
});
