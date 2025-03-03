import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './login'
import { MainPage } from './chatPage'
import { SignUp } from './SignUp'
import './material-theme/css/dark.css'
import './login.css'
import './chatPage.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chatPage" element={<MainPage />} />
        <Route path="/signUpPage" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
