import { useState } from 'react'
import { getUsers, saveUsers, setCurrentUser, getCurrentUser } from '../lib/storage'

export default function Auth({ onAuth }){
  const [mode,setMode] = useState('login')
  const [name,setName] = useState('')
  const [instagram,setInstagram] = useState('')
  const [phone,setPhone] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [identifier,setIdentifier] = useState('') // phone or email for login

  const submit = (e) => {
    e.preventDefault()
    const users = getUsers()
    if(mode==='register'){
      if(!name || !phone || !password) return alert('Заполните все поля')
      if(users.find(u=>u.phone===phone)) return alert('Такой номер уже зарегистрирован')
      const user = { name, instagram, phone, email, password }
      users.push(user); saveUsers(users); setCurrentUser(user); onAuth?.(user)
    }else{
      const id = identifier.trim()
      const user = users.find(u => (u.phone === id || u.email === id) && u.password === password)
      if(!user) return alert('Неверный логин или пароль')
      setCurrentUser(user); onAuth?.(user)
    }
  }

  const logout = () => { setCurrentUser(null); onAuth?.(null) }
  const current = getCurrentUser()

  if(current){
    return (
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>
            <div><b>{current.name}</b> <small className="muted">({current.phone})</small></div>
            {current.email && <div><small className="muted">Email: {current.email}</small></div>}
            {current.instagram && <div><small className="muted">Instagram: {current.instagram}</small></div>}
          </div>
          <button className="ghost" onClick={logout}>Выйти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <button className={mode==='login'?'':'ghost'} onClick={()=>setMode('login')}>Вход</button>
        <button className={mode==='register'?'':'ghost'} onClick={()=>setMode('register')}>Регистрация</button>
      </div>
      <form onSubmit={submit} className="row">
        {mode==='register' && (
          <div className="col">
            <label>Имя</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Например, Inga" />
          </div>
        )}
        {mode==='register' && (
          <div className="col">
            <label>Instagram</label>
            <input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@username" />
          </div>
        )}
        {mode==='register' && (
          <div className="col">
            <label>Email (опционально)</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
        )}
        {mode==='register' ? (
          <div className="col"><label>Телефон</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+3706..." /></div>
        ) : (
          <div className="col"><label>Телефон или Email</label><input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="+3706... или email" /></div>
        )}
        <div className="col"><label>Пароль</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
        <div className="col" style={{alignSelf:'end'}}><button type="submit">{mode==='login'?'Войти':'Зарегистрироваться'}</button></div>
      </form>
    </div>
  )
}
