import React, { ReactElement, useRef, useState } from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { Tabs } from 'antd'

interface Props {}

interface InitialItems {
  label: string
  children: JSX.Element
  key: string
}

const tablog = (props: Props) => {
  const initialItems = [
    {
      label: 'Login',
      children: <Login />,
      key: '1',
    },
    {
      label: 'Cadastro',
      children: <Signup finished={(value) => setActiveKey(value)} />,
      key: '2',
    },
  ]

  const [activeKey, setActiveKey] = useState<string>(initialItems[0].key);
  const [items, setItems] = useState<Array<InitialItems>>(initialItems);
  const newTabIndex = useRef(0);
  
  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: 'New Tab',
      children: <div></div>,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  
  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };
  return (
    <div
      className='h-screen w-screen flex center justify-center bg-secondary'
    >
      <Tabs 
        className='flex flex-col justify-center gap-2 bg-slate-100 border rounded-lg mx-auto my-auto w-[30rem] h-[40rem] shadow-md shadow-slate-600'
        type='card'
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  )
}

export default tablog