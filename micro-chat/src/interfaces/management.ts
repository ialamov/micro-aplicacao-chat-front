export interface DataAxiosManagement {
  data: { usersInfo: Array<UserInfoManagement>}
  status: string 
}

export interface UserInfoManagement {
  id: string
  name: string
  phone: string
  email: string
} 

export interface Message {
  id: string,
  roomId: string,
  user: {
    name: string,
    id: string
  },
  message: string,
  updatedAt: Date,
  createdAt: Date
}