import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '../../../server/createContext'
import { appRouter } from '../../../server/route/app.router'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    console.error(error)
  },
})
