import '../styles/App.Module.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar/Navbar'
import { Suspense, useState } from 'react'
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
import { useRouter } from 'next/router';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js'
import { ActiveMessage, AlertObj } from '../types/types'





axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API;
axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;


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

  const router = useRouter();

  const [imgObj, setImgObj] = React.useState({
    src: "",
    open: false
  });

  const [alertObj, setAlertObj] = React.useState<AlertObj>({
    message: null,
    state: ''
  });

  const [authenticated, setauthenticated] = React.useState(false)
  const [emojiList, setEmojiList] = React.useState([])
  const [emotions, setEmotions] = React.useState([])
  const [reactions, setReactions] = React.useState([])
  const [echo, setEcho] = React.useState({})
  const [activeMessages, setActiveMessages] = React.useState<ActiveMessage[]>([]);
  const [messageNotifications, setMessageNotifications] = React.useState([]);

  const setAlert = (message, state, redirect = null) => {
    setAlertObj({
      message: message,
      state: state
    });

    setTimeout(() => {
      setAlertObj({
        message: null,
        state: ''
      });
      if (redirect !== null) {
        
        router.push(redirect);
      }
    }, 2000);
  };

  const getBase46 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    });
  };

  const handleFileRead = async (e, callback) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.match('image.*')) {
          const base64 = await getBase46(file);
          callback(base64);
        } else {
          //handle error
          setAlert('Please select a valid image', 'error')
        }
      }
      
      
  };

  const openMessage = (item) => {
    let curr: ActiveMessage[] = [...activeMessages];
    let index = curr.findIndex(obj => obj.id === item.id);

    if (index >= 0) {
        // handle set first position and open
        let currObj = curr.splice(index, 1)[0];
        currObj.isOpen = true;
        curr.unshift(currObj);

    } else {
        // handle adding new item
        let newObj: ActiveMessage = {
            isOpen: true,
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            profile: item.profile,
            messages: [],
        };

        console.log('setting', newObj);

        curr.unshift(newObj);
    }

    setActiveMessages(curr);
}

  const channelOptions = {
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
    authEndpoint: process.env.NEXT_PUBLIC_BACKEND_CHANNEL_AUTH
  }

  React.useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setauthenticated(isLoggedIn);

    if (isLoggedIn) {

      axios.defaults.headers.common['Authorization'] = `Bearer ${fetchCookie()}`;

      channelOptions.auth = {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + fetchCookie(),
        }
      }

      axios.get('/emojiList')
        .then(res => {
          setEmojiList(res.data);
          var emts = res.data.filter(item => item.type === "emotion");
          var reactions = res.data.filter(item => item.type === "reaction");
          setEmotions(emts);
          setReactions(reactions);
        }).catch(err => {
          console.log(err);
        });
      
      

      // console.log(echo)
    }

    var echo = new Echo({
      ...channelOptions,
      client: new Pusher(channelOptions.key, channelOptions)
    });

    axios.defaults.headers.common['X-Socket-Id'] = echo.socketId();

    setEcho(
      echo
    )

    

    // console.log('app', echo.options.auth);

   
    
  }, [authenticated])
  


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
          authenticated,
          setauthenticated,
          emotions,
          reactions,
          echo,
          handleFileRead,
          setActiveMessages,
          activeMessages,
          messageNotifications,
          setMessageNotifications,
          openMessage,
        }}>
          <Navbar />
          <div className="page-container">
            <Component {...pageProps} className='main-container' />
          </div>
          {!!authenticated && (
            <MessagesContainer
              activeMessages={activeMessages}
              setActiveMessages={setActiveMessages}
            />
          )}
          <ImageModal open={imgObj.open} src={imgObj.src} togleFun={toggleImage} refImg={refImg}/>
         </Context.Provider>
      </Suspense>
    </>
  )
}
