import { Popconfirm, Table } from 'antd'
import axios from 'axios'
import { useLottie } from 'lottie-react'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/context'
import { DataAxiosManagement, UserInfoManagement } from '../interfaces/management'
import management from '../assets/management.json'
import { DeleteOutlined, DeleteTwoTone, ProfileTwoTone } from '@ant-design/icons'
import Chat from '../components/chat'
import { decode } from '../utils/jwtFunctions'
import { useNavigate } from 'react-router-dom'

interface Props {}

const UserManagement = (props: Props) => {
  const navigate = useNavigate()
  const [content, setContent] = useState<Array<UserInfoManagement>>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [chatInfo, setChatInfo] = useState<UserInfoManagement>({
    id: '',
    name: '',
    phone: '',
    email: ''
  } )
  const user = useContext(UserContext)

  useEffect(() => {
    let token: string | null = ''
    if (user.state.token) {
      token = user.state.token
    } else {
      token = localStorage.getItem('microChat')
    }
    tokenExpiration(token)
    axios.get<DataAxiosManagement>('http://localhost:5555/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(({data}) => {
        return setContent(data?.data?.usersInfo)
      })
      .catch((err) => console.log(err))
  }, [])

  const tokenExpiration = (token: string | null) => {
    return (token && decode(token)) ?? navigate('/')
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: management
  };

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5555/v1/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${user.state.token}`
      }
    }).then(() => {
      if (id === user.state.id) {
        localStorage.removeItem('microChat')
        navigate('/')
      } else {
        setContent(content.filter(handle => handle.id !== id))
      }
    })
  }

  const { View } = useLottie(defaultOptions, { width: '25%', height: '25%', marginLeft: 'auto', marginRight: 'auto' })
  
  return (
    <div
      className='bg-secondary h-screen'
      >
      {View}
      {openModal ? 
      (
        <Chat 
          content={chatInfo}
          loggedUser={user.state}
          cancel={() => setOpenModal(false)}
        />
      ) :
      (
        <div>
          <Table
            className='w-[80%] mx-auto'
            columns={
              [
                {
                  title: 'Nome',
                  dataIndex: [
                    'name'
                  ],
                },
                {
                  title: 'E-mail',
                  dataIndex: [
                    'email'
                  ]
                },
                {
                  title: 'Celular',
                  dataIndex: [
                    'phone'
                  ]
                },
                {
                  title: 'Ações',
                  render: (element) => {
                    return (
                      <div>
                        <ProfileTwoTone 
                          className='mr-2'
                          onClick={() => {
                            setChatInfo(element)
                            setOpenModal(true)}
                          } 
                            
                        />
                        <Popconfirm 
                          title={'Tem certeza que deseja excluir este contato?'}
                          onConfirm={() => handleDelete(element.id)}
                        >
                          <DeleteOutlined
                            className='text-red-400 ml-2' 
                          />
                        </Popconfirm>
  
                      </div>
                    )
                  } 
                }
              ]
            }
            dataSource={content}
            pagination={false}
          />
        </div>
      )    
    }

    </div>
  )
}

export default UserManagement