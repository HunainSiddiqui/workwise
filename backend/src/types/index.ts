import {z} from "zod";


export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  fullname: z.string().min(4)
});


export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
