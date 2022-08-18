import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      {/* add the favicon to all pages */}
      <Head>
        <meta
          name="description"
          content="Blog where you can create new news to keep the public always up to date"
        />
        <link rel="shortcut icon" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
