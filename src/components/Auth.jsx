import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { getUsers, saveUsers, getCurrentUser, saveCurrentUser, findUserByLogin, findUserByPhone, findUserByEmail, logoutUser, ensureDefaultAdmins } from '../utils/storage';

export default function Auth(){
  const { t } = useI18n();
  const [mode,setMode]=useState('login');
  const [login,setLogin]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [email,setEmail]=useState('');
  const [inst,setInst]=useState('');
  const [regPass,setRegPass]=useState('');

  useEffect(()=>{ try{ ensureDefaultAdmins() }catch(e){} },[]);

  const user=getCurrentUser();

  const doLogin=()=>{
    const u=findUserByLogin(login.trim());
    if(!u || u.password!==password.trim()){ alert('Неверный логин или пароль'); return }
    saveCurrentUser(u); window.location.reload();
  };

  const doRegister=()=>{
    if(!name || !phone || !regPass){ alert('Заполните обязательные поля'); return }
    const users=getUsers();
    if(users.find(u=>u.phone===phone)){ alert('Телефон уже зарегистрирован'); return }
    if(email && users.find(u=>u.email===email)){ alert('Email уже зарегистрирован'); return }
    const newUser={ name, phone, email, instagram:inst, password:regPass };
    users.push(newUser); saveUsers(users); saveCurrentUser(newUser); window.location.reload();
  };

  const doLogout=()=>{ logoutUser(); window.location.reload() };

  return (
    <div className="card" style={{padding:20}}>
      <div style={{display:'flex',gap:12,marginBottom:20}}>
        <button onClick={()=>setMode('login')} className={mode==='login'?'tab active':'tab'}>{t('login')}</button>
        <button onClick={()=>setMode('register')} className={mode==='register'?'tab active':'tab'}>{t('register')}</button>
      </div>

      {mode==='login' && <>
        <label>Телефон или Email</label>
        <input className="input" value={login} onChange={e=>setLogin(e.target.value)} placeholder="+3706... / email" />
        <label style={{marginTop:12}}>Пароль</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="primary-btn" onClick={doLogin}>Вход</button>
        {user && <button className="secondary-btn" onClick={doLogout}>Выйти</button>}
      </>}

      {mode==='register' && <>
        <label>Имя</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <label style={{marginTop:10}}>Телефон</label>
        <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
        <label style={{marginTop:10}}>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={{marginTop:10}}>Instagram</label>
        <input className="input" value={inst} onChange={e=>setInst(e.target.value)} />
        <label style={{marginTop:10}}>Пароль</label>
        <input className="input" type="password" value={regPass} onChange={e=>setRegPass(e.target.value)} />
        <button className="primary-btn" style={{marginTop:15}} onClick={doRegister}>Зарегистрироваться</button>
      </>}
    </div>
  );
}
