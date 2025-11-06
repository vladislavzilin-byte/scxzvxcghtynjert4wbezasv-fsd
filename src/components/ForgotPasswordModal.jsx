import React, { useState } from 'react';
import { getUsers } from '../utils/storage';

export default function ForgotPasswordModal({ onClose }){
  const [phone,setPhone] = useState('');
  const [password,setPassword] = useState(null);
  const [error,setError] = useState(null);

  const find = ()=>{
    const list = getUsers();
    const u = list.find(x => String(x.phone||'').trim() === String(phone).trim());
    if(!u){ setPassword(null); setError('Номер не найден'); return; }
    setError(null); setPassword(u.password || '(пароль не задан)');
  };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:360,background:'#1f1f1f',color:'#fff',border:'1px solid #2c2c2c',borderRadius:14,padding:20,boxShadow:'0 8px 24px rgba(0,0,0,.4)'}}>
        <h3 style={{marginTop:0, textAlign:'center'}}>Восстановление пароля</h3>
        <input placeholder='Телефон' value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #444',background:'#2a2a2a',color:'#fff'}}/>
        <button onClick={find} style={{width:'100%',marginTop:10,padding:'10px',borderRadius:10,background:'#6b4eff',color:'#fff',border:'none',cursor:'pointer',fontWeight:600}}>Показать пароль</button>
        {error && <p style={{color:'#ff7a7a',marginTop:10}}>{error}</p>}
        {password && <div style={{marginTop:10,padding:'10px 12px',border:'1px solid #333',borderRadius:10,background:'#181a20'}}><div style={{opacity:.8,fontSize:12,marginBottom:6}}>Ваш пароль:</div><div style={{fontWeight:700,fontSize:18}}>{password}</div></div>}
        <button onClick={onClose} style={{width:'100%',marginTop:12,padding:'10px',borderRadius:10,background:'#333',color:'#bbb',border:'1px solid #555'}}>Закрыть</button>
      </div>
    </div>
  );
}
