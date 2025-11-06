
import React, { useState } from 'react'
import { getUsers, saveUsers, setCurrentUser } from '../lib/storage'

import ForgotPasswordModal from './ForgotPasswordModal'

export default function Auth({ onAuth }){
  const [mode,setMode]=useState('login')
  const [name,setName]=useState('')
  const [instagram,setInstagram]=useState('')
  const [phone,setPhone]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [identifier,setIdentifier]=useState('')

  const [fails, setFails] = useState(0)
  const [recoverOpen, setRecoverOpen] = useState(false)

  const login = (e)=>{
    e.preventDefault()
    const users = getUsers()
    const u = users.find(u =>
      (u.phone===identifier || u.email===identifier) &&
      u.password===password
    )
    if(u){
      setCurrentUser(u)
      onAuth && onAuth(u)
      setFails(0)
    }else{
      const f = fails+1
      setFails(f)
      if(f>=2) setRecoverOpen(true)
      alert('Неверный логин или пароль')
    }
  }

  const register = (e)=>{
    e.preventDefault()
    if(!phone && !email) return alert('Нужен телефон или email')
    const users = getUsers()
    if(users.find(u => u.phone===phone || (email && u.email===email))){
      return alert('Пользователь уже существует')
    }
    const u = { name, instagram, phone, email, password }
    users.push(u); saveUsers(users); setCurrentUser(u); onAuth && onAuth(u)
    setMode('login')
  }

  return (
    <div className="card" style={{marginBottom:16}}>
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <button className={mode==='login'?'':'ghost'} onClick={()=>setMode('login')}>Войти</button>
        <button className={mode==='register'?'':'ghost'} onClick={()=>setMode('register')}>Регистрация</button>
      </div>

      {mode==='login' ? (
        <form onSubmit={login} className="row">
          <div className="col">
            <label>Телефон или email</label>
            <input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="+3706... / email" />
          </div>
          <div className="col">
            <label>Пароль</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="col" style={{alignSelf:'end'}}>
            <button type="submit">Войти</button>
          </div>
        </form>
      ) : (
        <form onSubmit={register} className="row">
          <div className="col"><label>Имя</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Inga"/></div>
          <div className="col"><label>Instagram</label><input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@username"/></div>
          <div className="col"><label>Телефон</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+3706..."/></div>
          <div className="col"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></div>
          <div className="col"><label>Пароль</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></div>
          <div className="col" style={{alignSelf:'end'}}><button type="submit">Создать аккаунт</button></div>
        </form>
      )}

      <ForgotPasswordModal open={recoverOpen} onClose={()=>setRecoverOpen(false)} />
    </div>
  )
}
