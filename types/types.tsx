import { type } from "os";

export type Article = {
    id:    string|number|null;
    owner: string|number|null;
    creator: string|number|null;
    body: string|null;
    image: object;
    emotion: null;
    taged: [],
}

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    birthday: string
}

export type ImageObj = {
    src: string
}

export type AuthUser = {
    id: number,
    firstName: string,
    lastName: string,
    birthday: string,
    email: string,
    profile: ImageObj|null
}

export type AlertObj = {
    message: string|null,
    state: string
}

