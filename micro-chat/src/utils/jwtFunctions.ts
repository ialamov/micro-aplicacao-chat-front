import { message, MessageArgsProps } from "antd"
import { User } from "../interfaces/user"
import { jwtDecode } from 'jwt-decode'


export const decode = (token: string): User | undefined => {
  const decoded: any = jwtDecode(token)

  const isTokenExpired = decoded.exp * 1000 > Date.now()

  if (isTokenExpired) {
    return {
      name: decoded.name,
      phone: decoded.phone,
      id: decoded.id,
      email: decoded.email,
      isLogged: true,
      token: token
    }
  } else {
    message.info('Realizar novo login')
    return undefined
  }
} 