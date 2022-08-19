import {
  createUserSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from '@/schema/user.schema'
import { BASEURL } from '@/src/constants'
import { decode, encode } from '@/utils/base64'
import { throwGenericError } from '@/utils/errors'
import { signJwt } from '@/utils/jwt'
import { sendEmail } from '@/utils/mailer'
import { checkDBConn } from '@/utils/prisma'
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime'
import * as trpcServer from '@trpc/server'
import { serialize } from 'cookie'
import { createRouter } from '../createRouter'

export const userRouter = createRouter()
  .mutation('register-user', {
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
        throwGenericError()
      }
    },
  })
  .mutation('request-otp', {
    input: requestOtpSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: { email: input.email },
        })
        const token = await ctx.prisma.loginToken.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        })
        await sendEmail({
          to: user.email,
          subject: `Login to your account, ${user.name}`,
          html: '<h1>Hi {{name}},</h1><p>Click <a href="{{BASEURL}}/login#token={{token}}">here</a> to login.</p>',
          htmlInput: {
            name: user.name,
            BASEURL,
            token: encode(`${token.id}:${user.email}`),
          },
        })
        return true
      } catch (e) {
        checkDBConn(e)
        if (e instanceof NotFoundError) {
          throw new trpcServer.TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          })
        }
        throwGenericError()
      }
    },
  })
  .query('verify-otp', {
    input: verifyOtpSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const decoded = decode(input.hash).split(':')
        const [id, email] = decoded
        const token = await ctx.prisma.loginToken.findFirstOrThrow({
          where: { id, user: { email } },
          include: { user: true },
        })
        const jwt = signJwt({ email: token.user.email, id: token.user.id })
        ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }))
        return {
          message: 'success',
        }
      } catch (e) {
        checkDBConn(e)
        if (e instanceof NotFoundError) {
          throw new trpcServer.TRPCError({
            code: 'FORBIDDEN',
            message: 'Invalid token',
          })
        }
        throwGenericError()
      }
    },
  })
  .query('me', {
    resolve: ({ ctx }) => ctx.user,
  })
