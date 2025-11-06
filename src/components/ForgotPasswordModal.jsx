
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
      <div className="modal-overlay" style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
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
