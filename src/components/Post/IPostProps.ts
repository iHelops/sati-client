import {IMinifiedUser} from "../../types/user";

export interface IPostProps {
    id: string,
    author: {
        id: string,
        name: string,
        avatar?: string,
        verified: boolean,
    },
    attachments?: string[],
    content: string,
    created_at: string,
    likes: IMinifiedUser[],
    commentsCount: number
}