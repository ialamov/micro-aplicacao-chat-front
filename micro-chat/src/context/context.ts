import { createContext, Dispatch, SetStateAction } from "react";
import { User } from '../interfaces/user'
import { UserInfoManagement } from "../interfaces/management";

export const UserContext = createContext<
  { 
    state: User,
    setState: Dispatch<SetStateAction<User>> | undefined
  }>(
    {
      state: {
        name: '',
        email: '',
        id: '',
        phone: '',
        token: '',
        isLogged: false,
      }, 
      setState: undefined
    }
  )

export const ReceiverContext = createContext<
  {
    state: UserInfoManagement | undefined
    setState: Dispatch<SetStateAction<UserInfoManagement>> | undefined
  }>(
    {
      state: undefined,
      setState: undefined
    }
  )