import jwt_decode from "jwt-decode";
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next';
import { AuthUser } from "../types/types";

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
    fetchCookie
}