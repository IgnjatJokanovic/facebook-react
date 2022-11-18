import '../styles/App.Module.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { Suspense } from 'react'
import Pageloader from '../components/loaders/Pageloader'
import MessagesContainer from '../components/messages/MessagesContainer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Suspense fallback={ <Pageloader /> }>
        <Navbar />
          <Component {...pageProps} />
          <MessagesContainer />
      </Suspense>
    </>
  )
}
