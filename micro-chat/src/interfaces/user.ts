export interface User {
  name?: string | undefined
  email?: string | undefined
  id?: string | undefined
  phone?: string | undefined
  token?: string | undefined
  isLogged?: boolean
}

export interface LoginResponse {
  token: string;
}