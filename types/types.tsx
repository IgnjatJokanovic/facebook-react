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
    active: boolean,
    profile: ImageObj|null
}

export type AlertObj = {
    message: string|null,
    state: string
}

export type Comment = {
    id: number|null,
    body: string|null,
    user_id: number,
    post_id: number,
    comment_id: number|null,
}

export type Message = {
    id: number,
    from: number,
    to: number,
    body: string,
    opened: boolean,
}

export type ActiveMessage = {
    isOpen: boolean,
    id: number,
    firstName: string,
    lastName: string,
    profile: string|null,
    messages: Message[],
    isLoading: boolean,
    nextPage: number,
    newMessage: {},
    editMessage: {}
}

export type MessageNotification = {
    id: number,
    firstName: string,
    lastName: string,
    profile: string | null,
    messageId: number,
    from: number,
    to: number,
    body: string,
    created_at: string,
    opened: boolean,
}

export type MessageDto = {
    id: number,
    from: number,
    to: number,
    body: string,
    opened: boolean,
    user: AuthUser,
    created_at: string,
}

export type LoginRequest = {
    email: string,
    password: string,
}

export type PasswordResetRequest = {
    email: string,
}

export type PasswordResetUpdateRequest = {
    token: string,
    password: string,
    repeatPassword: string;
}

export type UpdatePasswordRequest = {
    password: string,
    repeatPassword: string;
}

export type UpdateUserRequest = {
    email: string,
    birthday: string,
    firstName: string,
    lastName: string,
}

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    repeatPassword: string;
  }

