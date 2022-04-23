import '../styles/global.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>{"The Cobb's in NZ"}</title>
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
