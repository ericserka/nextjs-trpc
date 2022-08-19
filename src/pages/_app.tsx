import { AppRouter } from '@/server/route/app.router'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import superjson from 'superjson'
import '../styles/globals.css'
// imports for Font Awesome icons work
import { TRPCURL } from '@/src/constants'
import { trpc } from '@/utils/trpc'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'
import { UserContextProvider } from '../context/user.context'
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
  const { data, isLoading, error } = trpc.useQuery(['users.me'])
  if (isLoading) {
    return (
      <h1 className="text-5xl text-center font-bold">
        Checking if user is logged...
      </h1>
    )
  }
  return (
    <UserContextProvider value={data}>
      {/* add title to all pages */}
      <Head>
        <title>Next.js + tRPC</title>
      </Head>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [
      loggerLink(),
      httpBatchLink({ maxBatchSize: 10, url: TRPCURL }),
    ]
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      links,
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          }
        }
        return {}
      },
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
