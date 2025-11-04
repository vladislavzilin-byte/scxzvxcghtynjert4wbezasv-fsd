import React, { useState } from 'react'
import { getUsers, saveUsers } from '../lib/storage'

export default function ForgotPasswordModal({ onClose }){
  const [email,setEmail] = useState('')
  const [busy,setBusy] = useState(false)
  const [msg,setMsg] = useState(null)
  const submit = async (e)=>{
    e.preventDefault()
    if(!email) return
    setBusy(true); setMsg(null)
    try{
      const r = await fetch('http://localhost:4000/api/reset-password',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
      const data = await r.json()
      if(data && data.tempPassword){
        const list = getUsers()
        const i = list.findIndex(u=>u.email===email)
        if(i>=0){ list[i] = { ...list[i], password: data.tempPassword, mustChangePassword: true }; saveUsers(list) }
      }
      setMsg('Если e-mail зарегистрирован, вы получите письмо с временным паролем.')
    }catch(e){ setMsg('Ошибка отправки. Проверьте сервер.') }finally{ setBusy(false) }
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Восстановление пароля</h3>
        <form onSubmit={submit}>
          <label>E-mail</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" />
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button type="submit" disabled={busy}>{busy?'Отправка...':'Отправить'}</button>
            <button type="button" className="ghost" onClick={onClose}>Отмена</button>
          </div>
        </form>
        {msg && <p style={{marginTop:10}}>{msg}</p>}
      </div>
    </div>
  )
}
