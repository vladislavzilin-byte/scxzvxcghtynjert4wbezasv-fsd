import React, { useState } from "react";
import { getUsers } from "../utils/storage";

export default function ForgotPasswordModal({ onClose }) {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    const users = getUsers();
    const user = users.find((u) => (u.phone||'').trim() === phone.trim());

    if (!user) {
      setResult(null);
      setError("Номер не найден");
      return;
    }

    setError(null);
    setResult(user.password);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(4px)', zIndex: 999
    }} onClick={onClose}>
      <div className="modal-box" style={{
        width: '360px', padding: '24px', borderRadius: '14px',
        background: '#1f1f1f', color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
      }} onClick={(e)=>e.stopPropagation()}>
        <h2 style={{ marginBottom: '14px', textAlign: 'center' }}>Восстановление пароля</h2>

        <input
          type="text"
          placeholder="Ваш телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #444', background:'#2a2a2a', color:'white', marginBottom:'10px' }}
        />

        <button onClick={handleSearch} style={{
          width:'100%', padding:'10px', borderRadius:'10px', background:'#6b4eff', color:'white', border:'none', marginTop:'8px', cursor:'pointer', fontWeight:'600'
        }}>Показать пароль</button>

        {error && <p className="error" style={{color:'#ff7a7a', marginTop:10}}>{error}</p>}
        {result && (
          <div className="success" style={{marginTop:10,padding:'10px 12px',border:'1px solid #333',borderRadius:10,background:'#181a20'}}>
            <div style={{opacity:.8, fontSize:12, marginBottom:6}}>Ваш пароль:</div>
            <div style={{fontSize:18, fontWeight:700}}>{result}</div>
          </div>
        )}

        <button className="ghost" onClick={onClose} style={{
          width:'100%', marginTop:'12px', padding:'10px', borderRadius:'10px', background:'#333', color:'#bbb', border:'1px solid #555', cursor:'pointer'
        }}>Закрыть</button>
      </div>
    </div>
  );
}
