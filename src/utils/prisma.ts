import { PrismaClient } from '@prisma/client'
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime'
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

export const updateOrDeleteNonexistentRecord = (
  error: any,
  entityName: string
) => {
  if (error instanceof PrismaClientKnownRequestError) {
    // check https://www.prisma.io/docs/reference/api-reference/error-reference for errors codes
    // An operation failed because it depends on one or more records that were required but not found. {cause}
    if (error.code === 'P2025') {
      throw new trpcServer.TRPCError({
        code: 'NOT_FOUND',
        message: `${entityName} not found`,
      })
    }
  }
}
