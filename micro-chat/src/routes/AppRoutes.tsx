import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import UserManagement from "../pages/UserManagement"
import Tablog from "../pages/tablog"


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: "/", element: <Tablog />},
      { path: "/management", element: <UserManagement />}
    ]
  }
])