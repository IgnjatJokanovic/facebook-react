import '../styles/App.Module.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar/Navbar'
import { Suspense } from 'react'
import Pageloader from '../components/loaders/Pageloader'
import MessagesContainer from '../components/messages/MessagesContainer'
import Head from 'next/head'
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React from 'react'
import Context from '../context/context'
import ImageModal from '../components/ImageModal'
import Alert from '../components/Alert'
import { isAuthenticated, fetchCookie } from '../helpers/helpers'


axios.defaults.baseURL = 'http://localhost/api';
axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// axios.interceptors.request.use(request => {
//       if (
//           request.method == 'post' ||
//           request.method == 'put' ||
//           request.method == 'delete'
//       ){ 
//           axios.get('/sanctum/csrf-cookie')
//             .then(res => {
//               console.log(res);
              
//               let csrf = getCookie('XSRF-TOKEN')
//               axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf
//               console.log(csrf);
//             })
//             .catch(err => console.log(err));
//       }
      
//       return request;
    
//   })

export default function App({ Component, pageProps }: AppProps) {

  const [imgObj, setImgObj] = React.useState({
    src: "",
    open: false
  });

  const [alertObj, setAlertObj] = React.useState({
    message: null,
    state: ''
  });

  const [authenticated, setauthenticated] = React.useState(false)
  const [emojiList, setEmojiList] = React.useState([])

  const setAlert = (message, state) => {
    setAlertObj({
      message: message,
      state: state
    });

    setTimeout(() => {
      setAlertObj({
        message: null,
        state: ''
      });
    }, 2000);
  };



  React.useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setauthenticated(isLoggedIn)
    if (isLoggedIn) {

      axios.defaults.headers.common['Authorization'] = `Bearer ${fetchCookie()}`;

      axios.get('/emojiList')
        .then(res => {
          setEmojiList(res.data);
        }).catch(err => {
          console.log(err);
        })
    }
  }, [])
  


  const refImg = React.useRef();

  const toggleImage = () => {
      setImgObj({ ...imgObj, open: !imgObj.open});
  }

  return (
    <>
      <Head>
        <title>Facebook</title>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />
      </Head>
      <Suspense fallback={<Pageloader />}>
        <Alert alertObj={alertObj} />
        <Context.Provider value={{
          setImgObj,
          setAlert,
          emojiList,
          authenticated
        }}>
          <Navbar />
          <div className="page-container">
            <Component {...pageProps} className='main-container' />
          </div>
          <MessagesContainer />
          <ImageModal open={imgObj.open} src={imgObj.src} togleFun={toggleImage} refImg={refImg}/>
         </Context.Provider>
      </Suspense>
    </>
  )
}
