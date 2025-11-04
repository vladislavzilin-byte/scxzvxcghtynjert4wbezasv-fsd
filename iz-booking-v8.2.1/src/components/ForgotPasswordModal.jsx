import React, { useState } from 'react'
import { getUsers, saveUsers } from '../lib/storage'

export default function ForgotPasswordModal({ onClose }){
  const [email,setEmail] = useState('')
  const [busy,setBusy] = useState(false)
  const [msg,setMsg] = useState(null)
  const [temp,setTemp] = useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    if(!email) return
    setBusy(true); setMsg(null); setTemp(null)
    try{
      const r = await fetch('/api/reset-password',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
      const data = await r.json()
      if(data && data.tempPassword){
        setTemp(data.tempPassword)
        const list = getUsers()
        const i = list.findIndex(u=>u.email===email)
        if(i>=0){ list[i] = { ...list[i], password: data.tempPassword, mustChangePassword: true }; saveUsers(list) }
        setMsg('Новый пароль сгенерирован. Скопируйте и войдите.')
      }else{
        setMsg('Если e-mail зарегистрирован, вы получите пароль.')
      }
    }catch(e){
      setMsg('Ошибка. Попробуйте позже.')
    }finally{
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Восстановление пароля</h3>
        <form onSubmit={submit}>
          <label>E-mail</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button type="submit" disabled={busy}>{busy?'Отправка...':'Получить пароль'}</button>
            <button type="button" className="ghost" onClick={onClose}>Отмена</button>
          </div>
        </form>
        {temp && <div style={{marginTop:10,padding:'10px 12px',border:'1px solid #333',borderRadius:10,background:'#181a20'}}>
          <div style={{opacity:.8, fontSize:12, marginBottom:6}}>Ваш новый пароль:</div>
          <div style={{fontSize:18, fontWeight:700}}>{temp}</div>
        </div>}
        {msg && <p style={{marginTop:10}}>{msg}</p>}
      </div>
    </div>
  )
}
