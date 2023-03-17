import jwt_decode from "jwt-decode";
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next';
import { AuthUser, Comment } from "../types/types";
import axios from "axios";

const tokenName = 'user-token';


const isAuthenticated = (): boolean => {
    return hasCookie(tokenName);
};


const login = (jwt_token: string) => {
    setCookie(tokenName, jwt_token, { maxAge: 60 * 60 * 24 });
}

const logout = (): void => {
    deleteCookie(tokenName);
}

const getClaims = (): AuthUser|null => {
    return isAuthenticated() ? jwt_decode(fetchCookie()) : null;
}

const fetchCookie = () => {
    return getCookie(tokenName);
}

const refreshToken = () => {
    axios.get('/auth/refreshToken')
        .then(res => {
            console.log('token', res.data)
            login(res.data);
        })
        .catch(err => {

        });
}

const validateComment = (comment:Comment) => {
    return new Promise((resolve, reject) => {
        if (comment.body?.length) {
            return resolve('');
        }
        return reject("Comment cant be empty");
      
    })
}



// const validateArticle = post => {
//     return new  Promise((resolve, reject) => {
//         if(
//             post.body === null &&
//             post.image === null &&
//             post.emotion === null &&
//             post.taged.length === 0
//         ){
//             return reject("Fill up something on a post");
//         }else{
//             return resolve();
//         }
//     });
// };

export {
    isAuthenticated,
    // validateArticle,
    login,
    logout,
    getClaims,
    fetchCookie,
    validateComment,
    refreshToken
}