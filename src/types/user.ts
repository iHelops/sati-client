export interface IMinifiedUser {
    avatar?: string,
    id: string,
    name: string,
    subscribers: number,
    verified: boolean
}

export interface IUser {
    activated: boolean,
    avatar?: string,
    email: string,
    id: string,
    name: string,
    subscribers: IMinifiedUser[] | [],
    subscriptions: IMinifiedUser[] | [],
    verified: boolean,
    role: string
}