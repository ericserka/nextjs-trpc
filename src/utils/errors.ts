import * as trpcServer from '@trpc/server'

export const throwGenericError = () => {
  throw new trpcServer.TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  })
}
