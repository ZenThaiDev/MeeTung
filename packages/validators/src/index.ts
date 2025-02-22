import { date, z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const LoginPostSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username must only contain letters and numbers without spaces",
    )
    .min(1),
  password: z.string().min(1),
});

export const RegisterPostSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Username must only contain letters, numbers, hyphens, and underscores without spaces",
    ),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  password: z.string(),
});

export const createTransactionSchema = z.object({
  amount: z.number().int(),
  description: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  paymentMethodId: z.string().min(1),
  createdAt: date(),
});

export const editTransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().int(),
  description: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  paymentMethodId: z.string().min(1),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
});

export const CreatePaymentMethodSchema = z.object({
  name: z.string().min(1),
  userId: z.string().min(1),
});
