import React, {FC} from 'react';
import {INotifyProps} from "./INotifyProps";
import style from './Notify.module.scss'
import {Typography} from "antd";

const {Text} = Typography

const Notify: FC<INotifyProps> = ({type = 'success', message, icon}) => {
    return (
        <div className={`${style.notify} ${style[type]}`}>
            {icon ? <>
                <div className={style.icon}>{icon}</div>
            </> : <></>}
            <Text className={style.message}>{message}</Text>
        </div>
    );
};

export default Notify;