import React, {FC, useState} from 'react';
import {ICommentsModalProps} from "./CommentsModalProps";
import Comment from "../Comment/Comment";
import {dateParse} from "../../utils/dateParse";
import {Button, Empty, Input, Modal, Skeleton} from "antd";
import style from './CommentsModal.module.scss'
import {SendOutlined} from "@ant-design/icons";
import user from "../../store/user";

const { TextArea } = Input;

const CommentsModal: FC<ICommentsModalProps> = ({comments, open, onClose, loading, onSend}) => {
    const [newComment, setNewComment] = useState<string>('')

    const onSendComment = () => {
        if (newComment === '') return
        onSend(newComment)
        setNewComment('')
    }

    return (
        <Modal open={open} onCancel={onClose} destroyOnClose footer={null} className={style['comments-modal']} centered>
            <div className={style.comments}>
                {!loading ? <>
                    {comments.length > 0 ? <>
                        {comments.map(item => (
                            <Comment
                                key={item.id}
                                author={item.author}
                                date={dateParse(item.created_at)}
                                text={item.content}
                            />
                        ))}
                    </> : <>
                        <Empty description='Нет комментариев'/>
                    </>}
                </> : <>
                    <Skeleton avatar paragraph={{ rows: 2 }} active />
                </>}
            </div>
            <div className={style.send}>
                <TextArea
                    autoSize
                    placeholder='Написать комментарий'
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    disabled={!user.isAuth}
                />
                <Button
                    type='text'
                    className={style.button}
                    icon={<SendOutlined />}
                    onClick={onSendComment}
                    disabled={!user.isAuth}
                ></Button>
            </div>
        </Modal>
    );
};

export default CommentsModal;