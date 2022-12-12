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

axios.defaults.baseURL = 'http://localhost';
axios.interceptors.request.use(request => {
    if (
        request.method == 'post' ||
        request.method == 'put' ||
        request.method == 'delete'
    ){ 
        axios.get('/sanctum/csrf-cookie')
            .then(res => {
            
                let cookie = Cookies.get('XSRF-TOKEN');

                if (!cookie) {
                    return Promise.reject('Couldnt make csrf token')
                }
            });
    }
    
    return request;
   
})
