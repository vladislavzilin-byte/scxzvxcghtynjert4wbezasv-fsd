import React, { useState } from 'react';
import { getCurrentUser, updateUser, saveCurrentUser } from '../utils/storage';
export default function Profile(){
  const me = getCurrentUser();
  if(!me){ return <div className='card'><h3>Мой профиль</h3><p className='muted'>Войдите, чтобы редактировать профиль.</p></div>; }
  const [name,setName] = useState(me.name||''); const [phone,setPhone] = useState(me.phone||''); const [instagram,setInstagram] = useState(me.instagram||''); const email = me.email || '';
  const [oldPass,setOldPass] = useState(''); const [newPass,setNewPass] = useState(''); const [confirm,setConfirm] = useState(''); const [msg,setMsg] = useState('');
  const saveInfo = ()=>{ const u = { ...me, name, phone, instagram }; updateUser(u); saveCurrentUser(u); setMsg('Данные обновлены'); };
  const changePassword = ()=>{ if(String(oldPass)!==String(me.password||'')){ setMsg('Старый пароль неверный'); return; } if((newPass||'').length<4){ setMsg('Новый пароль слишком короткий'); return; } if(newPass!==confirm){ setMsg('Подтверждение пароля не совпадает'); return; } const u={...me,password:newPass}; updateUser(u); saveCurrentUser(u); setMsg('Пароль изменён'); setOldPass(''); setNewPass(''); setConfirm(''); };
  return (<div className='card'><h3>Мой профиль</h3>
    <label>Имя</label><input value={name} onChange={e=>setName(e.target.value)} />
    <label>Телефон</label><input value={phone} onChange={e=>setPhone(e.target.value)} />
    <label>Email (нельзя изменить)</label><input value={email} disabled />
    <label>Instagram</label><input value={instagram} onChange={e=>setInstagram(e.target.value)} />
    <button onClick={saveInfo}>Сохранить изменения</button>
    <h4>Смена пароля</h4>
    <input type='password' placeholder='Старый пароль' value={oldPass} onChange={e=>setOldPass(e.target.value)} />
    <input type='password' placeholder='Новый пароль' value={newPass} onChange={e=>setNewPass(e.target.value)} />
    <input type='password' placeholder='Повторите новый пароль' value={confirm} onChange={e=>setConfirm(e.target.value)} />
    <button onClick={changePassword}>Изменить пароль</button>
    {msg && <p className='success' style={{marginTop:8}}>{msg}</p>
  }</div>);
}