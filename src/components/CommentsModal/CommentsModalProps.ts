import {IComment} from "../../types/comments";

export interface ICommentsModalProps {
    comments: IComment[],
    open: boolean,
    onClose: () => void,
    loading?: boolean,
    onSend: (text: string) => void
}