
import React, { useEffect, useState } from 'react'
import { getCurrentUser, setCurrentUser, getUsers, saveUsers } from '../lib/storage'
import { useI18n } from '../lib/i18n'

export default function Profile(){
  const { t } = useI18n()
  const [user, setUser] = useState(getCurrentUser())
  const [msg, setMsg] = useState(null)

  useEffect(()=>{
    setUser(getCurrentUser())
  }, [])

  if(!user){
    return (
      <div className="card" style={{marginTop:16}}>
        <h2>{t('my_profile')}</h2>
        <p>{t('profile_login_hint')}</p>
      </div>
    )
  }

  const [form, setForm] = useState({
    name: user.name || '',
    instagram: user.instagram || '',
    phone: user.phone || '',
    email: user.email || '',
    password: user.password || ''
  })

  const onChange = (k)=>(e)=> setForm(prev=>({...prev, [k]: e.target.value }))

  const onSave = (e)=>{
    e.preventDefault()
    // basic checks
    if(!form.phone && !form.email){
      setMsg(t('profile_need_contact'))
      return
    }

    // Update users array
    const users = getUsers()
    const idx = users.findIndex(u => (u.phone && u.phone===user.phone) || (u.email && u.email===user.email))
    const updated = { ...users[idx>=0?idx:0], ...form }
    if(idx>=0) users[idx] = updated; else users.push(updated)
    saveUsers(users)

    setCurrentUser(updated)
    setUser(updated)
    setMsg(t('profile_saved'))
    setTimeout(()=>setMsg(null), 1500)
  }

  return (
    <div className="card" style={{marginTop:16}}>
      <h2>{t('my_profile')}</h2>
      <form onSubmit={onSave} className="row">
        <div className="col">
          <label>{t('name')}</label>
          <input value={form.name} onChange={onChange('name')} placeholder="Inga" />
        </div>
        <div className="col">
          <label>{t('instagram')}</label>
          <input value={form.instagram} onChange={onChange('instagram')} placeholder="@username" />
        </div>
        <div className="col">
          <label>{t('phone')}</label>
          <input value={form.phone} onChange={onChange('phone')} placeholder="+3706..." />
        </div>
        <div className="col">
          <label>{t('email_opt')}</label>
          <input value={form.email} onChange={onChange('email')} placeholder="name@example.com" />
        </div>
        <div className="col">
          <label>{t('password')}</label>
          <input type="password" value={form.password} onChange={onChange('password')} placeholder="••••••••" />
        </div>
        <div className="col" style={{alignSelf:'end'}}>
          <button type="submit">{t('save')}</button>
        </div>
      </form>
      {msg && <div className="notif success" style={{marginTop:8}}>{msg}</div>}
    </div>
  )
}
