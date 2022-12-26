import React from 'react';
import {useRoutes} from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import PublicRoute from "./PublicRoute";
import Profile from "../pages/Profile/Profile";

const Routes = () => {
    return useRoutes([
        {
            path: '/',
            element: <Home/>,
        },
        {
            path: '/profile/:userId',
            element: <Profile/>,
        },
        {
            path: '/login',
            element: <PublicRoute component={<Login/>}/>
        },
        {
            path: '/registration',
            element: <PublicRoute component={<Registration/>}/>
        },
    ])
};

export default Routes;