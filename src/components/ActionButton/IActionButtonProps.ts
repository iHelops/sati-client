import {ReactNode} from "react";

export interface IActionButtonProps {
    icon?: ReactNode,
    text: string | number,
    active?: boolean,
    onClick?: () => void
 }