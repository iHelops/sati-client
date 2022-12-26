import React, {useState} from 'react';
import style from './Login.module.scss'
import {Button, Card, Form, Input, message} from "antd";
import {NavLink, useNavigate} from "react-router-dom";
import {IAuthForm} from "../../types/forms";
import user from "../../store/user";

const Login = () => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const requiredFormItem = {
        required: true,
        message: ''
    }

    const onFinish = ({email, password}: IAuthForm) => {
        setButtonLoading(true)

        user.login(email, password).then(() => {
            navigate('/')
        }).catch((error) => {
            if (error.response.data === 'wrong login or password') {
                messageApi.error('Неверный логин или пароль')
            }
        }).finally(() => {
            setButtonLoading(false)
        })
    }

    return (
        <div className={style.login}>
            {contextHolder}
            <Card
                title='Авторизация'
                className={style.card}
                extra={<NavLink to={'/registration'}>Зарегистрироваться</NavLink>}
            >
                <Form size='large' className={style.form} onFinish={onFinish}>
                    <Form.Item name='email' rules={[{type: 'email', message: ''}, requiredFormItem]}>
                        <Input  placeholder='Email'/>
                    </Form.Item>
                    <Form.Item name='password' rules={[requiredFormItem]}>
                        <Input.Password placeholder='Пароль'/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' type='primary' loading={buttonLoading}>Войти</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;