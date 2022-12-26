import React, {FC} from 'react';
import {IRoute} from "./IRoute";
import user from "../store/user";
import {Navigate} from "react-router-dom";

const PrivateRoute: FC<IRoute> = ({component}) => {
    return (
        user.isAuth ? (() => component)() : <Navigate to='/'/>
    );
};

export default PrivateRoute;