import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as trpcServer from '@trpc/server'
import { createUserSchema } from '@/schema/user.schema'
import { checkDBConn } from '@/utils/prisma'
import { createRouter } from '../createRouter'

export const userRouter = createRouter().mutation('register-user', {
  input: createUserSchema,
  resolve: async ({ ctx, input }) => {
    try {
      return await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
        },
      })
    } catch (e) {
      checkDBConn(e)
      if (e instanceof PrismaClientKnownRequestError) {
        // check https://www.prisma.io/docs/reference/api-reference/error-reference for errors codes
        // Unique constraint failed on the {constraint}
        if (e.code === 'P2002') {
          throw new trpcServer.TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          })
        }
      }
      throw new trpcServer.TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      })
    }
  },
})
