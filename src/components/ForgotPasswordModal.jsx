
import React, { useState } from 'react'
import { getUsers } from '../lib/storage'

export default function ForgotPasswordModal({ open, onClose }){
  const [phone, setPhone] = useState('')
  const [found, setFound] = useState(null)

  if(!open) return null

  const findUser = (e)=>{
    e.preventDefault()
    const users = getUsers()
    const u = users.find(x => x.phone===phone || x.email===phone)
    if(!u){ setFound({ error: 'Пользователь не найден' }); return }
    setFound({ password: u.password })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Восстановление пароля</h3>
        <p><small className="muted">Введите телефон (или email), привязанный к аккаунту.</small></p>

        <form onSubmit={findUser} style={{display:'flex', gap:8, marginTop:10}}>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+3706... / email" />
          <button type="submit">Найти</button>
        </form>

        {found && found.password && (
          <div style={{marginTop:12}}>
            <p><b>Ваш пароль:</b></p>
            <div className="badge" style={{fontSize:14}}>{found.password}</div>
            <div style={{marginTop:10}}>
              <button onClick={onClose}>Ок</button>
            </div>
          </div>
        )}

        {found && found.error && (
          <div style={{marginTop:12}} className="badge">{found.error}</div>
        )}
      </div>
    </div>
  )
}
