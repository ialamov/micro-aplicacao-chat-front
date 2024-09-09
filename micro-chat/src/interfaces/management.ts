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