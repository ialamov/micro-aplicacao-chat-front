import { Button, Form, Input, message, Row } from 'antd'
import { useLottie } from 'lottie-react'
import axios from 'axios'
import signupImg from '../assets/signup.json'

interface Props {
  finished: (value: string) => void
}

const Signup = (props: Props) => {
  const [form] = Form.useForm()
  const fields = [
    { label: 'Nome', name: 'name' },
    { label: 'Email', name: 'email' },
    { label: 'Celular', name: 'phone' },
    { label: 'Senha', name: 'password' }
  ]

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: signupImg
  };

  const { View } = useLottie(defaultOptions, { width: '50%', height: '50%', marginLeft: 'auto', marginRight: 'auto' })

  const onFinish = () => {
    form.validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        console.log(values)
        axios.post('http://localhost:5555/v1/users/', {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password
        })
        .then(response => {
          message.success('Usuário cadastrado com sucesso')
          console.log('User registered successfully:', response.data)
          form.resetFields()
          props.finished('1')
        })
        .catch(error => {
          if (error.response.data.message.includes('Validation')) {
            message.error('Já existe um usuário cadastrado com uma, ou mais, destas informações')
          }
          console.error('Error registering user:', error)
        })
      })
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className='flex flex-col justify-center gap-0 bg-slate-100 border rounded-lg mx-auto my-auto w-[30rem] h-[40rem] shadow-md shadow-slate-600'
    >
      {View}
      {fields.map( ({label, name}) => {
        return (
          <Form.Item
            key={name}
            label={<div className='w-12 flex justify-between'>{label}</div>}
            rules={
              [
                {
                  required: true,
                  message: 'Preencha o campo'
                }
              ]
            }
            validateTrigger='onSubmit'
            className='w-2/3 mx-auto mb-3 '
            name={name}
          >
            <Input
              placeholder={label}
              type={label === 'Senha' ? 'password' : 'text'}
            />
        </Form.Item>
        )
      })}
      <Row
        justify='end'
      >
        <Button
          className='w-2/3 mx-auto'
          type='primary'
          htmlType='submit'
        >
          Cadastrar
        </Button>
      </Row>
    </Form>
  )
}

export default Signup