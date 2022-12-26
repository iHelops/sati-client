import {IMinifiedUser} from "./user";

export interface IPost {
    id: string,
    content: string,
    created_at: string,
    author: IMinifiedUser,
    attachments: string[],
    likes: IMinifiedUser[],
    comments: number
}