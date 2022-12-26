import React, {useState} from 'react';
import style from "./Registration.module.scss";
import {Button, Card, Form, Input, message} from "antd";
import {NavLink, useNavigate} from "react-router-dom";
import {IRegistrationForm} from "../../types/forms";
import user from "../../store/user";

const Registration = () => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const onFinish = ({name, email, password}: IRegistrationForm) => {
        setButtonLoading(true)

        user.registration(email, name, password).then(() => {
            navigate('/')
        }).catch((error) => {
            if (error.response.data === 'email already exist') {
                messageApi.error('Такой Email уже зарегистрирован')
            }
        }).finally(() => {
            setButtonLoading(false)
        })
    }

    const requiredFormItem = {
        required: true,
        message: ''
    }

    return (
        <div className={style.registration}>
            {contextHolder}
            <Card
                title='Регистрация'
                className={style.card}
                extra={<NavLink to={'/login'}>Войти</NavLink>}
            >
                <Form size='large' className={style.form} onFinish={onFinish}>
                    <Form.Item name='name' rules={[requiredFormItem]}>
                        <Input  placeholder='Имя пользователя'/>
                    </Form.Item>
                    <Form.Item name='email' rules={[{type: 'email', message: ''}, requiredFormItem]}>
                        <Input  placeholder='Email'/>
                    </Form.Item>
                    <Form.Item name='password' rules={[requiredFormItem]} hasFeedback>
                        <Input.Password placeholder='Пароль'/>
                    </Form.Item>
                    <Form.Item
                        name='confirm'
                        hasFeedback
                        rules={[
                            requiredFormItem,
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            })
                        ]}
                    >
                        <Input.Password placeholder='Подтвердите пароль'/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' type='primary' loading={buttonLoading}>Зарегистрироваться</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Registration;