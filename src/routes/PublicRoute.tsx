import React, {FC} from 'react';
import user from "../store/user";
import {IRoute} from "./IRoute";
import {Navigate} from "react-router-dom";

const PublicRoute: FC<IRoute> = ({component}) => {
    return (
        !user.isAuth ? (() => component)() : <Navigate to='/'/>
    );
};

export default PublicRoute;