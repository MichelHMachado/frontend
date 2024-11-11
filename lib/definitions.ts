import { z } from "zod";

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Be at least 8 characters long" }),
});

export const TransactionSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number")
    .min(1, { message: "Amount is required" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date is invalid",
  }),
});

export const CategorySchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  userUuid: z.string().uuid({ message: "Invalid user UUID" }),
});

export type CategoryType = z.infer<typeof CategorySchema>;
