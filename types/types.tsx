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
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    birthday: string
}

export type AlertObj = {
    message: string|null,
    state: string
}