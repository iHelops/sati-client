import React, {FC} from 'react';
import style from './ActionButton.module.scss'
import {IActionButtonProps} from "./IActionButtonProps";
import {Typography} from "antd";

const {Text} = Typography

const ActionButton: FC<IActionButtonProps> = ({text, icon, active = false, onClick}) => {
    return (
        <div className={`${style['action-button']} ${active ? style.active : ''}`} onClick={onClick}>
            {icon ? <>
                <div className={style.icon}>{icon}</div>
            </> : <></>}
            <div className={style.text}>
                <Text>{text}</Text>
            </div>
        </div>
    );
};

export default ActionButton;