import React from 'react'
import ForgotPasswordModal from './ForgotPasswordModal'
import { getUsers, saveUsers, setCurrentUser } from '../lib/storage'

export default function Login(){
  const [email,setEmail] = React.useState('')
  const [password,setPassword] = React.useState('')
  const [showForgot,setShowForgot] = React.useState(false)
  const [msg,setMsg] = React.useState(null)

  const doLogin = (e)=>{
    e.preventDefault()
    const users = getUsers()
    const u = users.find(x=>x.email===email && String(x.password)===String(password))
    if(u){ setCurrentUser(u); setMsg('Вход выполнен') } else { setMsg('Неверный e-mail или пароль') }
  }

  // seed admins if empty
  React.useEffect(()=>{
    const list = getUsers()
    if(list.length===0){
      list.push({ email:'irina.abramova7@gmail.com', password:'vladiokas', role:'admin', name:'Irina' })
      list.push({ email:'vladislavzilin@gmail.com', password:'vladiokas', role:'admin', name:'Vladislav' })
      saveUsers(list)
    }
  },[])

  return (<div className="card">
    <h3>Вход</h3>
    <form onSubmit={doLogin}>
      <label>E-mail</label><input value={email} onChange={e=>setEmail(e.target.value)} />
      <label>Пароль</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Войти</button>
      <div style={{marginTop:8}}><button type="button" className="ghost" onClick={()=>setShowForgot(true)}>Забыли пароль?</button></div>
    </form>
    {msg && <p style={{marginTop:8}}>{msg}</p>}
    {showForgot && <ForgotPasswordModal onClose={()=>setShowForgot(false)} />}
  </div>)
}
