import React, {FC, useState} from 'react';
import style from './Header.module.scss'
import {AutoComplete, Button, Card, Col, Dropdown, Empty, Input, MenuProps, Row} from "antd";
import Logo from '../../assets/images/Logo.svg'
import {IHeaderProps} from "./IHeaderProps";
import User from "../User/User";
import user from "../../store/user";
import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";
import {DownOutlined, LogoutOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {declension, SUBSCRIBER_FORM} from "../../utils/declension";
import {IMinifiedUser} from "../../types/user";
import api from "../../api";

const Header: FC<IHeaderProps> = ({withUser = true}) => {
    const navigate = useNavigate()
    const [search, setSearch] = useState<IMinifiedUser[]>([])
    const [searchTimer, setSearchTimer] = useState<any>(null)

    const onSearch = (value: string) => {
        if (searchTimer) clearTimeout(searchTimer)
        if (!value.trim()) {
            setSearch([])
            return
        }

        setSearchTimer(
            setTimeout(() => {
                api.User.search(value).then(res => setSearch(res.data))
            }, 500)
        )
    }

    const onSelect = (value: string) => navigate('/profile/' + value)

    const searchResult = () => {
        return search.map(item => {
            return {
                value: item.id,
                label: <User
                    avatarId={item.avatar}
                    name={item.name}
                    verified={item.verified}
                    description={`${item.subscribers} ${declension(SUBSCRIBER_FORM, item.subscribers)}`}
                    size='small'
                />
            }
        })
    }

    const onLogin = () => {
        navigate('/login')
    }

    const onLogout = () => {
        user.logout().then(() => {
            navigate('/')
        })
    }

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            label: <Link to={'/profile/' + user.user.id}>Профиль</Link>,
            icon: <UserOutlined />
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: <div onClick={onLogout}>Выйти из аккаунта</div>,
            icon: <LogoutOutlined />,
            danger: true
        },
    ];

    return (
        <div className={style.header}>
            <Row gutter={[10, 10]}>
                <Col xs={24} md={withUser ? 15 : 24}>
                    <Card size='small' className={style.card}>
                        <Link to='/' style={{height: 40}}>
                            <img src={Logo} alt="SATI"/>
                        </Link>

                        <AutoComplete onSearch={onSearch} onSelect={onSelect} options={searchResult()} notFoundContent={<Empty/>} className={style.search}>
                            <Input placeholder='Поиск пользователей' prefix={<SearchOutlined style={{paddingRight: 5}}/>}/>
                        </AutoComplete>
                    </Card>
                </Col>

                {withUser ? <>
                    <Col xs={24} md={9}>
                        {user.isAuth ? <>
                            <Card size='small'>
                                <Dropdown menu={{ items }} trigger={['click']}>
                                    <div className={style.user}>
                                        <User
                                            size='small'
                                            name={user.user.name}
                                            description={`${user.user.subscribers.length} ${declension(SUBSCRIBER_FORM, user.user.subscribers.length)}`}
                                            verified={user.user.verified}
                                            avatarId={user.user.avatar}
                                        />
                                        <DownOutlined className={style.dropdown}/>
                                    </div>
                                </Dropdown>
                            </Card>
                        </> : <>
                            <Card size='small'>
                                <Button size='large' type='text' style={{width: '100%'}} onClick={onLogin}>Войти в аккаунт</Button>
                            </Card>
                        </>}
                    </Col>
                </> : <></>}
            </Row>
        </div>
    );
};

export default observer(Header);