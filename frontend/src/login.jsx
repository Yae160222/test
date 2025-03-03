import { useNavigate } from "react-router-dom"
import './material-theme/css/dark.css'
import "./login.css"
import { useState } from "react"
import { createScoket } from "./Constants"

export const Login = ()=>{
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    async function handleClick(event){
        console.log('hi')
        event.preventDefault()
        const data = {
            email: email,
            password: password
        }
        const queryString = Object.keys(data)
        .map( key=> encodeURIComponent(key)+'='+encodeURIComponent(data[key]))
        .join('&')
        const verify = await fetch(`http://localhost:3000/verify?${queryString}`,{
            method: 'GET',
            headers: {
                'Content-Type':'Application/json'
            },
        })
        const response = await verify.text()
        console.log(response)
        createScoket(data)
        if(response === 'valid'){
            navigate(`/chatPage`)
        }
    }
    return(
        <div className="login">
            <form>
                <h4 className="h4">email</h4>
                <input type = "email" placeholder="email" value={ email } onChange={ (e)=> setEmail(e.target.value)}></input>
                <h4 className="h4">password</h4>
                <input type = "password" placeholder="password" value={ password } onChange={ (e)=> setPassword(e.target.value) }></input>
                <button onClick={handleClick}> login </button>
                <div onClick={() => {navigate('/signUpPage')}}> SignUp </div>
            </form>
        </div>
    )
}