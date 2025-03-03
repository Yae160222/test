import { Link, Outlet,BrowserRouter, Route, Routes } from "react-router-dom"
import "./Base.css"
import './material-theme/css/dark.css'
import './login.css'
import './chatPage.css'
import { Login } from "./login"
import { MainPage } from "./chatPage"
import { SignUp } from "./SignUp"
export const Base = () =>{
    return(
        <>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/chatPage" element={<MainPage/>}/>
                <Route path="/signUpPage" element={<SignUp/>}/>
            </Routes>
        </>
    )
}