import jwt_decode from "jwt-decode";
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next';

const tokenName = 'user-token';


const isAuthenticated = () => {
    return hasCookie(tokenName);
};


const login = (jwt_token) => {
    setCookie(tokenName, jwt_token);
}

const logout = () => {
    deleteCookie(tokenName);
}

const getClaims = () => {
    return jwt_decode(fetchCookie());
}

const fetchCookie = () => {
    return getCookie(tokenName);
}

const validateArticle = post => {
    return new  Promise((resolve, reject) => {
        if(
            post.body === null &&
            post.image === null &&
            post.emotion === null &&
            post.taged.length === 0
        ){
            return reject("Fill up something on a post");
        }else{
            return resolve();
        }
    });
};

export {
    isAuthenticated,
    validateArticle,
    login,
    logout,
    getClaims,
    fetchCookie
}