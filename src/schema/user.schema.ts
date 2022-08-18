import * as z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nome necessário'),
  email: z.string().email('E-mail inválido'),
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>
