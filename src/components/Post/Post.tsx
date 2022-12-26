import React, {FC, useEffect, useState} from 'react';
import {IPostProps} from "./IPostProps";
import style from './Post.module.scss'
import {Card, Dropdown, Image, MenuProps, Typography} from "antd";
import User from "../User/User";
import {dateParse} from "../../utils/dateParse";
import api from "../../api";
import ActionButton from "../ActionButton/ActionButton";
import user from "../../store/user";
import {
    CommentOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    HeartFilled,
    HeartOutlined
} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import CommentsModal from "../CommentsModal/CommentsModal";
import posts from "../../store/posts";
import comments from "../../store/comments";
import {observer} from "mobx-react-lite";

const {Text} = Typography

const Post: FC<IPostProps> = ({id,author, attachments, likes, content, created_at, commentsCount}) => {
    const imageWidth = attachments?.length === 2 ? 'calc(50% - 2.5px)' : 'calc(33.33% - 3.5px)'
    const navigate = useNavigate()
    const [liked, setLiked] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState<number>(likes.length)

    const onLikeClick = () => {
        if (!user.isAuth) {
            navigate('/login')
            return
        }

        if (liked) {
            posts.unlike(id)
            setLiked(false)
            setLikeCount(prev => prev - 1)
        } else {
            posts.like(id)
            setLiked(true)
            setLikeCount(prev => prev + 1)
        }
    }

    useEffect(() => {
        likes.forEach(item => {
            if (item.id === user.user.id) {
                setLiked(true)
            }
        })
    }, [likes])

    const [commentCount, setCommentCount] = useState<number>(commentsCount)
    const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false)

    const onCommentsOpen = () => {
        comments.fetchComments(id)
        setIsCommentsOpen(true)
    }

    const onCommentsClose = () => setIsCommentsOpen(false)

    const onSendComment = (text: string) => {
        comments.createComment(id, text).then(() => {
            setCommentCount(prev => prev + 1)
        })
    }

    const onDeletePost = () => {
        user.user.role === 'admin' ? posts.adminRemove(id, author.id) : posts.remove(id)
    }

    const items: MenuProps['items'] = [
        {
            key: 'logout',
            label: <div onClick={onDeletePost}>Удалить запись</div>,
            icon: <DeleteOutlined />,
            danger: true
        },
    ];

    return (
        <div className={style.post}>
            <Card size='small'>
                <div className={style.user}>
                    <Link to={'/profile/' + author.id}>
                        <User name={author.name} description={dateParse(created_at)} avatarId={author.avatar} verified={author.verified}/>
                    </Link>

                    {user.user.id === author.id || user.user.role === 'admin' ? <>
                        <div className={style.actions}>
                            <Dropdown menu={{ items }} placement="bottomRight">
                                <EllipsisOutlined />
                            </Dropdown>
                        </div>
                    </> : <></>}
                </div>
                <div className={style.content}>
                    <Text>{content}</Text>
                </div>
                {attachments && attachments.length > 0 ? <>
                    <div className={`${style.attachments}`}>
                        {attachments.length === 1 ? <>
                            <div className={style['solo-image']}>
                                <div className={style.background} style={{backgroundImage: `url(${api.File.get(attachments[0])})`}}></div>
                                <div className={style.blur}></div>
                                <Image src={api.File.get(attachments[0])}/>
                            </div>
                        </> : <>
                            {attachments.map((hash, index) => (
                                <Image width={imageWidth} src={api.File.get(hash)} className={style.image} key={index} preview={{maskClassName: style.mask}}/>
                            ))}
                        </>}
                    </div>
                </> : <></>}
                <div className={style.buttons}>
                    <ActionButton text={likeCount} icon={liked ? <HeartFilled /> : <HeartOutlined />} onClick={onLikeClick} active={liked}/>
                    <ActionButton text={commentCount} icon={<CommentOutlined />} onClick={onCommentsOpen}/>
                </div>
            </Card>

            <CommentsModal
                comments={comments.comments}
                open={isCommentsOpen}
                onClose={onCommentsClose}
                loading={comments.loading}
                onSend={onSendComment}
            />
        </div>
    );
};

export default observer(Post);