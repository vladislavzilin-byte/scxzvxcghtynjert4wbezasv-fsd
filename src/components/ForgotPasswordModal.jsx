
import React, { useState } from 'react'
import { getUsers } from '../lib/storage'

export default function ForgotPasswordModal({ open, onClose }){
  const [phone,setPhone]=useState('')
  const [found,setFound]=useState(null)
  if(!open) return null
  const submit=e=>{
    e.preventDefault()
    const u=getUsers().find(x=>x.phone===phone||x.email===phone)
    if(!u) setFound({error:'Пользователь не найден'})
    else setFound({password:u.password})
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Восстановление пароля</h3>
        <form onSubmit={submit} style={{marginTop:10}}>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+3706..."/>
          <button type="submit">Найти</button>
        </form>
        {found?.password && <div className="badge" style={{marginTop:10}}>{found.password}</div>}
        {found?.error && <div className="badge" style={{marginTop:10}}>{found.error}</div>}
      </div>
    </div>
  )
}
