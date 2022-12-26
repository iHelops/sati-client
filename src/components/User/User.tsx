import React, {FC} from 'react';
import {IUserProps} from "./IUserProps";
import style from './User.module.scss'
import {Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import verifiedIcon from '../../assets/images/verified.svg'
import api from "../../api";

const {Title, Text} = Typography

const User: FC<IUserProps> = ({name,description, avatarId, verified, size='large', onlyAvatar=false}) => {
    return (
        <div className={style.user}>
            <div className={`${style.avatar} ${size === 'small' ? style.small : ''}`}>
                {avatarId ? <>
                    <img src={api.File.get(avatarId)} alt='' className={style.image}/>
                </> : <>
                    <div className={style.user}>
                        <UserOutlined />
                    </div>
                </>}
            </div>
            {!onlyAvatar ? <>
                <div className={style.text}>
                    <div className={style.name}>
                        <Title level={5} className={style.title}>{name}</Title>
                        {verified ? <>
                            <div className={style.verified}>
                                <img src={verifiedIcon} alt="verified"/>
                            </div>
                        </> : <></>}
                    </div>
                    <Text type='secondary'>{description}</Text>
                </div>
            </> : <></>}
        </div>
    );
};

export default User;