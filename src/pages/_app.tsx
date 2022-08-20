import { AppRouter } from '@/server/route/app.router'
import { TRPCURL } from '@/src/constants'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import superjson from 'superjson'
import '../styles/globals.css'

// imports for Font Awesome icons work
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {/* add title to all pages */}
      <Head>
        <title>Next.js + tRPC</title>
      </Head>
      <Component {...pageProps} />
    </>
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
