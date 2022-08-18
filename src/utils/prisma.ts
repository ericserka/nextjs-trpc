import { PrismaClient } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime'
import * as trpcServer from '@trpc/server'

// prevent multiple instances
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export const checkDBConn = (e: any) => {
  if (e instanceof PrismaClientInitializationError) {
    throw new trpcServer.TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to connect to the database. Try again later.',
    })
  }
}
