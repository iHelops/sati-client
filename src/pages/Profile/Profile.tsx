import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Header from "../../components/Header/Header";
import user from "../../store/user";
import {observer} from "mobx-react-lite";
import style from './Profile.module.scss'
import {Button, Card, Col, Empty, message, Row, Skeleton, Typography} from "antd";
import Post from "../../components/Post/Post";
import api from "../../api";
import {IUser} from "../../types/user";
import {UserOutlined} from "@ant-design/icons";
import verifiedIcon from "../../assets/images/verified.svg";
import posts from "../../store/posts";
import {declension, SUBSCRIBER_FORM, SUBSCRIPTION_FORM} from "../../utils/declension";
import PostWrite from "../../components/PostWrite/PostWrite";
import {checkFileExtension} from "../../utils/file";

const {Text, Title} = Typography

const Profile = () => {
    const {userId} = useParams()
    const navigate = useNavigate()

    const [profile, setProfile] = useState<IUser>()
    const [subscribersCount, setSubscribersCount] = useState<number>(0)
    const [actionButtonLoading, setActionButtonLoading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const avatarInput = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (userId) {
            posts.setLoading(true)
            setProfile(undefined)
            api.User.user(userId).then(res => {
                setProfile(res.data)
                setSubscribersCount(res.data.subscribers.length)
                posts.fetchUser(userId)
            }).catch(error => {
                if (error.response.data === 'User not found') {
                    navigate('/')
                }
            })
        }
    }, [navigate, userId])

    const onSubscribe = () => {
        setActionButtonLoading(true)
        user.subscribe(profile!.id).then(() => {
            setSubscribersCount(prev => prev + 1)
        }).finally(() => setActionButtonLoading(false))
    }

    const onUnsubscribe = () => {
        setActionButtonLoading(true)
        user.unsubscribe(profile!.id).then(() => {
            setSubscribersCount(prev => prev - 1)
        }).finally(() => setActionButtonLoading(false))
    }

    const onAvatarClick = () => avatarInput.current?.click()

    const onAvatarChange = (e: any) => {
        const file: File = e.target.files[0]
        if (!checkFileExtension(file, ['png', 'jpg', 'jpeg'])) {
            messageApi.error(`Файл ${file.name} не может быть загружен.`)
            return
        }

        user.changeAvatar(file).then(() => {
            navigate('/')
        })
    }

    const onLogout = () => {
        user.logout().then(() => navigate('/'))
    }

    return (
        <div className={style.profile}>
            {contextHolder}
            <div className="container">
                <input type='file' id='file' ref={avatarInput} style={{display: 'none'}} accept={'.png,.jpg,.jpeg'} onChange={e => onAvatarChange(e)}/>

                {user.user.id === userId ? <>
                    <Header withUser={false}/>
                </> : <Header/>}

                <Row gutter={10} className={style.content}>
                    <Col xs={{span: 24, order: 2}} md={{span: 15, order: 1}}>
                        <div className={style.posts}>
                            {posts.loading ? <>
                                <Card size='small'>
                                    <Skeleton avatar paragraph={{ rows: 3 }} active />
                                </Card>
                                <Card size='small'>
                                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                                </Card>
                                <Card size='small'>
                                    <Skeleton avatar paragraph={{ rows: 2 }} active />
                                </Card>
                            </> : <>
                                {user.isAuth && user.user.id === userId ? <>
                                    <PostWrite extensions={['jpeg', 'jpg', 'png', 'gif']}/>
                                </> : <></>}

                                {posts.posts.length > 0 ? <>
                                    {posts.posts.map(post => (
                                        <Post
                                            key={post.id}
                                            id={post.id}
                                            author={post.author}
                                            content={post.content}
                                            created_at={post.created_at}
                                            likes={post.likes}
                                            commentsCount={post.comments}
                                            attachments={post.attachments}
                                        />
                                    ))}
                                </> : <Card size='small'>
                                    <Empty description='Нет постов'/>
                                </Card>}
                            </>}
                        </div>
                    </Col>
                    <Col xs={{span: 24, order: 1}} md={{span: 9, order: 2}}>
                        <div className={style.user}>
                            <Card size='small'>
                                {profile ? <>
                                    <div className={style.avatar}>
                                        {user.user.id === userId ? <>
                                            <div className={style['change-overlay']} onClick={onAvatarClick}></div>
                                        </> : <></>}

                                        {profile.avatar ? <>
                                            <img src={api.File.get(profile.avatar)} alt='' className={style.image}/>
                                        </> : <>
                                            <div className={style.user}>
                                                <UserOutlined />
                                            </div>
                                        </>}
                                    </div>
                                    <div className={style.name}>
                                        <Title level={3} className={style.title}>{profile.name}</Title>
                                        {profile.verified ? <>
                                            <div className={style.verified}>
                                                <img src={verifiedIcon} alt="verified"/>
                                            </div>
                                        </> : <></>}
                                    </div>
                                    <div className={style.information}>
                                        <div className="subscribers">
                                            <Text>{subscribersCount}</Text>
                                            <Text type='secondary'> {declension(SUBSCRIBER_FORM, subscribersCount)}</Text>
                                        </div>
                                        <div className="subscriptions">
                                            <Text>{profile.subscriptions.length}</Text>
                                            <Text type='secondary'> {declension(SUBSCRIPTION_FORM, profile.subscriptions.length)}</Text>
                                        </div>
                                    </div>
                                    {user.isAuth ? <>
                                        <div className={style.action}>
                                            {user.user.id !== userId ? <>
                                                {user.checkSubscribe(userId!) ? <>
                                                    <Button type='primary' danger size='large' onClick={onUnsubscribe} loading={actionButtonLoading}>Отписаться</Button>
                                                </> : <>
                                                    <Button type='primary' size='large' onClick={onSubscribe} loading={actionButtonLoading}>Подписаться</Button>
                                                </>}
                                            </> : <>
                                                <Button type='primary' danger size='large' onClick={onLogout}>Выйти из аккаунта</Button>
                                            </>}
                                        </div>
                                    </> : <></>}
                                </> : <>
                                    <div className={style.avatar}></div>
                                    <div className={style.name}>
                                        <Skeleton paragraph={{rows: 1, width: '100%'}} title={false} style={{width: '50%'}}/>
                                    </div>
                                    <div className={style.information}>
                                        <Skeleton paragraph={{rows: 1, width: '100%'}} title={false} style={{width: '70%'}}/>
                                    </div>
                                </>}
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default observer(Profile);