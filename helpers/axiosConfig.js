import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://localhost",
//     withCredentials: true
// })


// const onRequest = (config) => {
//     return setCSRFToken()
//         .then(res => {
//             let cookie = Cookies.get('XSRF-TOKEN');

//             if (!cookie) {
//                 return Promise.reject('Couldnt make csrf token')
//             }
//             axiosInstance.defaults.headers.common['XSRF-TOKEN'] = cookie;
//             config;
//         });
// }

// const setCSRFToken = () => {
//     return axiosInstance.get('/sanctum/csrf-cookie');
// }

// axiosInstance.interceptors.request.use(() => {
//     return axiosInstance.get('/sanctum/csrf-cookie')
//         .then(res => {
               
//             }
//         );
// }, null);

// axios.defaults.baseURL = 'http://localhost';
// axios.interceptors.request.use(request => {
//     if (
//         request.method == 'post' ||
//         request.method == 'put' ||
//         request.method == 'delete'
//     ){ 
//         axios.get('/sanctum/csrf-cookie')
//             .then(res => {
            
//                 let cookie = Cookies.get('XSRF-TOKEN');

//                 if (!cookie) {
//                     return Promise.reject('Couldnt make csrf token')
//                 }
//             });
//     }
    
//     return request;
   
// })

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
