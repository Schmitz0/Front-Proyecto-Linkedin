import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { UserRoutes } from "../models/routes"
import { Buffer } from 'buffer';

export const AuthGuard = () => {
    //const userInfo = useSelector((store)=> store.userInfo)

    const token = localStorage.getItem('token')

    const userInfo = JSON.parse(Buffer.from(token.split('.')[1], 'BASE64').toString());

    return userInfo.role==='Admin' ? <Outlet/> : <Navigate replace to={'/'}/>
}

export default AuthGuard;