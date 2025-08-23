import z from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Username is required")
    .max(20, "Username can't be longer than 20 characters"),
  password: z
    .string()
    .min(8, "Password must be 8 characters longs.")
    .max(20, "Password can't be longer than 20 characters."),
});

export type userType = z.infer<typeof signupSchema>;
