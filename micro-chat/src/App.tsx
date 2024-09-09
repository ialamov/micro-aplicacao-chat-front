import { useState } from 'react'
import { Outlet } from 'react-router'
import Footer from './components/Footer'
import './index.css'
import { ReceiverContext, UserContext } from './context/context'
import { User } from './interfaces/user'
import { UserInfoManagement } from './interfaces/management'

function App() {
  const [userInfo, setUserInfo] = useState<User>({
    name: '',
    email: '',
    id: '',
    phone: '',
    token: '',
    isLogged: false,
  })

  const [receiverInfo, setReceiverInfo] = useState<UserInfoManagement>({
    name: '',
    email: '',
    id: '',
    phone: '',
  })

  return (
      <>
        <UserContext.Provider value={{state: userInfo, setState: setUserInfo}}>
          <ReceiverContext.Provider value={({state: receiverInfo, setState: setReceiverInfo})}>
            <Outlet />
            <Footer />
          </ReceiverContext.Provider>
        </UserContext.Provider>
      </>
  )
}

export default App
