import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom'
import api from "./api";
import auth from './store/user';
import {LoadingOutlined, MailFilled} from "@ant-design/icons";
import Routes from './routes/Routes'
import Notify from "./components/Notify/Notify";
import {observer} from "mobx-react-lite";

const App = () => {
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)

        api.User.check().then(res => {
            auth.setUserInformation(res.data)
            auth.setAuth(true)
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    return (
        isLoading ? <>
            <div className="loading-container">
                <LoadingOutlined className='loading'/>
            </div>
        </> : <>
            {auth.isAuth && !auth.user.verified ? <>
                <Notify
                    type='error'
                    message='Аккаунт не подтвержден. На вашу почту отправлено письмо для активации аккаунта'
                    icon={<MailFilled />}
                />
            </> : <></>}
            <BrowserRouter>
                <Routes/>
            </BrowserRouter>
        </>
    );
}

export default observer(App);
