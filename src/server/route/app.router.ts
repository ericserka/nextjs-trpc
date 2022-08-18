import { createRouter } from '../createRouter'

export const appRouter = createRouter().query('hello', {
  resolve: () => {
    return 'Hello world'
  },
})

export type AppRouter = typeof appRouter
