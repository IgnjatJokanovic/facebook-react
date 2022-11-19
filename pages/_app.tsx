import '../styles/App.Module.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { Suspense } from 'react'
import Pageloader from '../components/loaders/Pageloader'
import MessagesContainer from '../components/messages/MessagesContainer'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Facebook</title>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />
      </Head>
      <Suspense fallback={ <Pageloader /> }>
        <Navbar />
          <Component {...pageProps} />
          <MessagesContainer />
      </Suspense>
    </>
  )
}
