import React, { useState } from 'react'
import { getCurrentUser, setCurrentUser, getUsers, saveUsers } from '../lib/storage'

export default function Profile(){
  const me = getCurrentUser()
  const [edit,setEdit] = useState(false)
  const [form,setForm] = useState({ name: me?.name || '', phone: me?.phone || '', instagram: me?.instagram || '', email: me?.email || '', currentPassword:'', password:'' })
  const [msg,setMsg] = useState(null)

  if(!me){ return <div className="card"><h3>Мой профиль</h3><p className="muted">Войдите, чтобы редактировать профиль.</p></div> }

  const change=(k,v)=> setForm(p=>({...p,[k]:v}))
  const save=()=>{
    const list = getUsers()
    const i = list.findIndex(u=>u.email===me.email)
    if(i<0){ setMsg('Пользователь не найден'); return }
    if(form.password){
      const ok = (me.password? String(me.password):'') === String(form.currentPassword||'')
      if(!ok){ setMsg('Текущий пароль неверный'); return }
      list[i].password = form.password
      list[i].mustChangePassword = false
    }
    list[i].name=form.name; list[i].phone=form.phone; list[i].instagram=form.instagram
    saveUsers(list); setCurrentUser(list[i]); setEdit(false); setMsg('Изменения сохранены')
  }

  return (
    <div className="card">
      <h3>Мой профиль</h3>
      {!edit ? (<>
        <p><b>Имя:</b> {me.name||'—'}</p>
        <p><b>Телефон:</b> {me.phone||'—'}</p>
        <p><b>Instagram:</b> {me.instagram||'—'}</p>
        <p><b>E-mail:</b> {me.email||'—'}</p>
        <button onClick={()=>setEdit(true)}>✏️ Редактировать</button>
      </>) : (<>
        <div className="row">
          <div className="col"><label>Имя</label><input value={form.name} onChange={e=>change('name',e.target.value)} /></div>
          <div className="col"><label>Телефон</label><input value={form.phone} onChange={e=>change('phone',e.target.value)} /></div>
        </div>
        <label>Instagram</label><input value={form.instagram} onChange={e=>change('instagram',e.target.value)} placeholder="@username" />
        <label>E-mail (неизменяемый)</label><input value={form.email} disabled />
        <div className="hr" />
        <h4>Смена пароля</h4>
        <label>Текущий пароль</label><input type="password" value={form.currentPassword} onChange={e=>change('currentPassword',e.target.value)} />
        <label>Новый пароль</label><input type="password" value={form.password} onChange={e=>change('password',e.target.value)} />
        <div style={{display:'flex', gap:8, marginTop:10}}>
          <button onClick={save}>💾 Сохранить</button><button className="ghost" onClick={()=>setEdit(false)}>Отмена</button>
        </div>
      </>)}
      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </div>
  )
}
