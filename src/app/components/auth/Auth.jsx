import React, { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useAuth } from '../../hooks/useAuth';


export default function Auth({ cerrar }) {
  const [visible, setVisible] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [animateOut, setAnimateOut] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
      setAnimateOut(false);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setAnimateOut(true);
    setTimeout(() => cerrar(false), 300);
  };

  const switchModal = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setActiveModal(activeModal === 'login' ? 'register' : 'login');
      setAnimateOut(false);
    }, 500);
  };
  const {user} = useAuth()
useEffect(() => {
  if(user !== null && user !== ''){
    handleClose()
  }
}, [user])

  const isLogin = activeModal === 'login';

  const modalBaseClasses = `
    bg-white w-[448px] p-[24px] rounded-[16px] shadow-lg z-60
    flex flex-col justify-between absolute transition-all duration-400
  `;
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${visible ? 'bg-[rgba(0,0,0,0.34)] opacity-100' : 'opacity-0'}
      `}
    >
      <div onClick={handleClose} className='w-[100%] h-[100%]'></div>
      <Login modalBaseClasses={modalBaseClasses} isLogin={isLogin} animateOut={animateOut} handleClose={handleClose} switchModal={switchModal} />
      <Register modalBaseClasses={modalBaseClasses} isLogin={isLogin} animateOut={animateOut} handleClose={handleClose} switchModal={switchModal} />
    </div>
  );
}
