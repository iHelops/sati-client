import React, {FC} from 'react';
import {ICommentProps} from "./ICommentProps";
import style from './Comment.module.scss'
import User from "../User/User";
import {Typography} from "antd";
import {Link} from "react-router-dom";

const {Text} = Typography

const Comment: FC<ICommentProps> = ({author, text, date}) => {
    return (
        <div className={style.comment}>
            <Link to={'/profile/' + author.id}>
                <User name={author.name} description={date} avatarId={author.avatar} verified={author.verified} size='small'/>
            </Link>
            <div className={style.text}>
                <Text>{text}</Text>
            </div>
        </div>
    );
};

export default Comment;