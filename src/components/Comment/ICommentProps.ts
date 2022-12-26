export interface ICommentProps {
    author: {
        id: string,
        name: string,
        avatar?: string,
        verified: boolean,
    }
    date: string,
    text: string
}