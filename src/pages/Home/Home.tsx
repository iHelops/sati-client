import React, {useEffect} from 'react';
import Header from "../../components/Header/Header";
import {Card, Col, Empty, Row, Skeleton} from "antd";
import Post from "../../components/Post/Post";
import style from './Home.module.scss'
import posts from "../../store/posts";
import {observer} from "mobx-react-lite";
import user from "../../store/user";
import User from "../../components/User/User";
import {Link} from "react-router-dom";
import {declension, SUBSCRIBER_FORM} from "../../utils/declension";

const Home = () => {
    useEffect(() => {
        posts.fetchLast()
    }, [])

    return (
        <div className={style.home}>
            <div className='container'>
                <Header/>

                <Row gutter={[10, 10]} className={style.content}>
                    <Col xs={24} md={15}>
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
                            </>}
                        </div>
                    </Col>
                    <Col xs={24} md={9}>
                        <Card size='small' title='Вы отслеживаете'>
                            {user.isAuth ? <>
                                <div className={style.users}>
                                    {user.user.subscriptions.length > 0 ? <>
                                        {user.user.subscriptions.map(item => (
                                            <Link to={'/profile/' + item.id} key={item.id}>
                                                <User
                                                    size='small'
                                                    avatarId={item.avatar}
                                                    name={item.name}
                                                    verified={item.verified}
                                                    description={`${item.subscribers} ${declension(SUBSCRIBER_FORM, item.subscribers)}`}
                                                />
                                            </Link>
                                        ))}
                                    </> : <Empty description='Вы никого не отслеживаете'/>}
                                </div>
                            </> : <Empty description='Войдите в аккаунт для просмотра'/>}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default observer(Home);