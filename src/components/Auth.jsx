import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import {
  getUsers, saveUsers, findUserByPhone, findUserByEmail, findUserByLogin,
  getCurrentUser, saveCurrentUser, logoutUser, ensureDefaultAdmins
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  useEffect(() => { try { ensureDefaultAdmins(); } catch (e) {} }, []);

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const user = getCurrentUser();

  const doLogin = () => {
    const u = findUserByLogin(login.trim());
    if (!u) return alert('Пользователь не найден');
    if (u.password !== password) return alert('Неверный пароль');
    saveCurrentUser(u); window.location.reload();
  };

  const doRegister = () => {
    if (!regName || !regPhone || !regPassword) return alert('Заполните все поля');
    if (findUserByPhone(regPhone)) return alert('Телефон уже зарегистрирован');
    if (regEmail && findUserByEmail(regEmail)) return alert('Email уже зарегистрирован');
    const newUser = { name: regName, phone: regPhone, email: regEmail, instagram: regInstagram, password: regPassword };
    const users = getUsers(); users.push(newUser); saveUsers(users);
    saveCurrentUser(newUser); window.location.reload();
  };

  const doLogout = () => { logoutUser(); window.location.reload(); };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setMode('login')} className={mode==='login'?'tab active':'tab'}>Вход</button>
        <button onClick={() => setMode('register')} className={mode==='register'?'tab active':'tab'}>Регистрация</button>
      </div>
      {mode==='login' && (<>
        <label>Телефон или Email</label>
        <input value={login} onChange={e=>setLogin(e.target.value)} placeholder="+3706... / email" className="input"/>
        <label style={{marginTop:12}}>Пароль</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input"/>
        <button className="primary-btn" onClick={doLogin}>Вход</button>
      </>)}
      {mode==='register' && (<>
        <label>Имя</label>
        <input className="input" value={regName} onChange={e=>setRegName(e.target.value)}/>
        <label style={{marginTop:10}}>Телефон</label>
        <input className="input" value={regPhone} onChange={e=>setRegPhone(e.target.value)}/>
        <label style={{marginTop:10}}>Email</label>
        <input className="input" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/>
        <label style={{marginTop:10}}>Instagram</label>
        <input className="input" value={regInstagram} onChange={e=>setRegInstagram(e.target.value)}/>
        <label style={{marginTop:10}}>Пароль</label>
        <input className="input" type="password" value={regPassword} onChange={e=>setRegPassword(e.target.value)}/>
        <button className="primary-btn" style={{marginTop:15}} onClick={doRegister}>Зарегистрироваться</button>
      </>)}
      {user && <button className="secondary-btn" style={{marginTop:20}} onClick={doLogout}>Выйти</button>}
    </div>
  );
}
