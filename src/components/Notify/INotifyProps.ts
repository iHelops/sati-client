import {ReactNode} from "react";

export interface INotifyProps {
    type: 'success' | 'error',
    message: string,
    icon?: ReactNode
}