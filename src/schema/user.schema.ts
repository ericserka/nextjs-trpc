import * as z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>

export const requestOtpSchema = z.object({
  email: z.string().email('Invalid email'),
  redirect: z.string().default('/'),
})

export type RequestOtpInput = z.TypeOf<typeof requestOtpSchema>

export const verifyOtpSchema = z.object({
  hash: z.string(),
})

export type VerifyOtpInput = z.TypeOf<typeof verifyOtpSchema>
