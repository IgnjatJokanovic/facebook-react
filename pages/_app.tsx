import '../styles/App.Module.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { Suspense } from 'react'
import Pageloader from '../components/loaders/Pageloader'
import MessagesContainer from '../components/messages/MessagesContainer'
import Head from 'next/head'
import axios from 'axios';
import { getCookie } from 'cookies-next';

// Axios config
axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

axios.interceptors.request.use(request => {
      if (
          request.method == 'post' ||
          request.method == 'put' ||
          request.method == 'delete'
      ){ 
          axios.get('/sanctum/csrf-cookie')
            .then(res => {
              console.log(res);
              
              let csrf = getCookie('XSRF-TOKEN')
              axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf
              console.log(csrf);
            })
            .catch(err => console.log(err));
      }
      
      return request;
    
  })

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
