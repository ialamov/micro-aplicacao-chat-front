import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useLottie } from 'lottie-react'
import login from '../assets/login.json'
import { useNavigate } from 'react-router-dom'
import { LoginResponse, User } from '../interfaces/user'
import { UserContext } from '../context/context'
import { decode } from '../utils/jwtFunctions'

interface Props {}

const Login = (props: Props) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userInfo, setUserInfo] = useState<User>()
  
  const navigate = useNavigate()
  const user = useContext(UserContext)

  useEffect(() => {
    const token = localStorage.getItem('microChat')

    tokenExpiration(token)
  }, [])
  
  const tokenExpiration = (token: string | null) => {
    return (token && decode(token) && navigate('/management')) ?? navigate('/')
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: login
  };

  const { View } = useLottie(defaultOptions, { width: '50%', height: '50%', marginLeft: 'auto', marginRight: 'auto' })

  const onLogin = () => {
    axios.post<LoginResponse>('http://localhost:5555/v1/users/login', {email, password})
    .then((info) => {
        
        const logged = decode(info.data.token)
        localStorage.setItem('microChat', info.data.token)
        user.setState(logged)
        navigate('/management')
      })
      .catch((err) => {
        console.log(err)
        message.error('Usuário ou senha inválidos')
      })
  }

  return (
    <div className='flex flex-col justify-center gap-2 bg-slate-100 border rounded-lg mx-auto my-auto w-[30rem] h-[40rem] shadow-md shadow-slate-600'>
      {/* <Form
        
      > */}
        {View}
        <Input
          className='w-2/3 mx-auto'
          title='E-mail'
          type='email'
          placeholder='E-mail'
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          className='w-2/3 mx-auto'
          title='Senha'
          type='password'
          placeholder='Senha'
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()}
        />
        <Button
          className='w-2/3 mx-auto'
          type='primary'
          onClick={onLogin}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()}
        >
          Login
        </Button>
      {/* </Form> */}
    </div>
  )
}

export default Login