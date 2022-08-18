import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { AppRouter } from '../server/route/app.router'
// imports for Font Awesome icons work
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* add the favicon to all pages */}
      <Head>
        <title>Next.js + tRPC</title>
        <meta
          name="description"
          content="Blog where you can create new news to keep the public always up to date"
        />
        <link rel="shortcut icon" href="favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = 'http://localhost:3000/api/trpc'
    const links = [loggerLink(), httpBatchLink({ maxBatchSize: 10, url })]
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
