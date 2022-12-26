import {IMinifiedUser} from "./user";

export interface IComment {
    author: IMinifiedUser,
    content: string,
    created_at: string,
    id: string
}