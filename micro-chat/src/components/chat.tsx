import React, { useContext, useEffect, useState } from 'react'
import { UserInfoManagement } from '../interfaces/management'
import { Input, Modal } from 'antd'
import io from 'socket.io-client'
import { User } from '../interfaces/user'
import axios from 'axios'
import { ReceiverContext } from '../context/context'


interface Props {
  content: UserInfoManagement
  loggedUser: User
  cancel: () => void
}

const Chat = (props: Props) => {
  const socket = io('http://localhost:5555')
  const [content, setContent] = useState<UserInfoManagement>()
  const [roomId, setRoomId] = useState<string>('')
  const [messages, setMessages] = useState<Array<string>>([''])
  const receiver = useContext(ReceiverContext)

  useEffect(() => {
    props.content !== undefined && receiver.setState(props.content)
    setContent(props.content ?? receiver.state)
    
    findRoom().then(({data}) => {
      setRoomId((data as any).data.userInfo.id)
    }).then(() => {
      getMessages().then(({data}) => {
        setMessages((data as any).data.messages)
      })
    })
    

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const findRoom = async () => {
    return axios.get(`http://localhost:5555/v1/messages/${props.loggedUser.id}_${content?.id}`, {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    })
  }

  const getMessages = async () => {
    return axios.get(`http://localhost:5555/v1/messages/rooms/${roomId}_${props.loggedUser.id}`,  {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    })
  }

  return (
    <Modal
      onCancel={() => {
        socket.disconnect()
        props.cancel()
      }}
      open={true}
      title={`Chat - ${content?.name}`}
      width={'100%'}
    >
      <div>
      </div>
    </Modal>
  )
}

export default Chat