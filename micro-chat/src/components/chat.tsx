import React, { useContext, useEffect, useState } from 'react'
import { Message, UserInfoManagement } from '../interfaces/management'
import { Button, Form, Input, message, Modal, Popconfirm, Row } from 'antd'
import io from 'socket.io-client'
import { User } from '../interfaces/user'
import axios from 'axios'
import { ReceiverContext } from '../context/context'
import { PlusOutlined } from '@ant-design/icons'


interface Props {
  content: UserInfoManagement
  loggedUser: User
  cancel: () => void
}

const Chat = (props: Props) => {
  const [form] = Form.useForm()
  const socket = io('http://localhost:5555')
  const [content, setContent] = useState<UserInfoManagement>()
  const [roomId, setRoomId] = useState<string>('')
  const [messages, setMessages] = useState<Array<Message>>([])
  const receiver = useContext(ReceiverContext)

  useEffect(() => {
    props.content !== undefined && receiver.setState(props.content)
    setContent(props.content ?? receiver.state)
    
    findRoom(props.content.id).then(({data}) => {
      const room = (data as any).data.userInfo.id
      socket.emit('user_details', {...props.loggedUser, roomId: room})
      setRoomId(room)
      getMessages(room).then(({data}) => {
        console.log((data as any).data.messages)
        setMessages((data as any).data.messages)
      })
    })
  }, [content]);

  useEffect(() => {
    socket.on('receive_message', data => {
      data.roomId === roomId &&
      setMessages([...messages, data])
    })

    return () => {
      socket.off('receive_message');
    };
  }, [socket])

  const findRoom = async (receiver: string) => {
    return axios.get(`http://localhost:5555/v1/messages/${props.loggedUser.id}?receiver=${receiver}`, {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    })
  }

  const getMessages = async (id: string) => {
    return axios.get(`http://localhost:5555/v1/messages/rooms/${id}`,  {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    })
  }

  const handleSubmit = () => {
    const {inputMessage} = form.getFieldsValue()

    axios.post(`http://localhost:5555/v1/messages/${roomId}?sender=${props.loggedUser.id}`, {inputMessage}, 
    {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    }).then((info) => {
      socket.emit('set_messages', {inputMessage, ...props.loggedUser, roomId})
    }).then(() => {
      form.resetFields()
    })
  }

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5555/v1/messages/${id}`, {
      headers: {
        'Authorization': `Bearer ${props.loggedUser.token}`
      }
    }).then(() => {
      setMessages(messages.filter(handle => handle.id !== id))
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
      footer={null}
    >
      {
        messages.map((each) => {
          return (
            <div
              className='flex justify-between'
            >
              <div
                className='flex justify-start'
              >
                <p 
                  key={each.id}
                  className='font-bold mr-4 text-balance'
                >
                  {each.user.name}: 
                </p>
                <p
                >
                  {each.message}
                </p>
              </div>
              <Popconfirm 
                title={'Tem certeza que deseja excluir a conversa selecionada?'}
                onConfirm={() => handleDelete(each.id)}
              >
                <PlusOutlined 
                  className='rotate-45 text-red-400 w-10'
                />
              </Popconfirm>
            </div>
          )
        })
      }
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name='inputMessage'
          >
            <Input 
              type='text'
            />
          </Form.Item>
          <Row
            justify='end'
          >
            <Button
              type='primary'
              htmlType='submit'
            >
              Enviar
            </Button>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

export default Chat