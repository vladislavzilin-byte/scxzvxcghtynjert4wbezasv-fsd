import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';

import {
  getUsers,
  saveUsers,
  findUserByPhone,
  findUserByEmail,
  findUserByLogin,
  getCurrentUser,
  saveCurrentUser,
  logoutUser
  ensureDefaultAdmins
} from '../utils/storage';

export default function Auth() {
  useEffect(() => { try { ensureDefaultAdmins(); } catch(e){} }, []);
  const { t } = useI18n();

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');

  const [foundPass, setFoundPass] = useState(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');

  const user = getCurrentUser();

  const auroraField = {
    background: 'rgba(20,0,40,0.45)',
    border: '1px solid rgba(168,85,247,0.35)',
    color: '#fff',
    borderRadius: 12,
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: 15,
    backdropFilter: 'blur(6px)'
  };

  const auroraButton = {
    background: 'linear-gradient(135deg, #6a00ff, #3c0066)',
    border: '1px solid rgba(168,85,247,0.5)',
    borderRadius: 12,
    padding: '12px 14px',
    width: '100%',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 600,
    boxShadow: '0 0 15px rgba(138,43,226,0.35)',
    transition: '0.25s'
  };

  const loginHandler = () => {
    const u = findUserByLogin(login.trim());

    if (!u) {
      alert(t('user_not_found'));
      return;
    }

    if (u.password !== password.trim()) {
      alert(t('wrong_password'));
      return;
    }

    saveCurrentUser(u);
    window.location.reload();
  };

  const registerHandler = () => {
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !password.trim()) {
      alert(t('fill_all_fields'));
      return;
    }

    const existsPhone = findUserByPhone(regPhone.trim());
    const existsEmail = findUserByEmail(regEmail.trim());

    if (existsPhone || existsEmail) {
      alert(t('user_exists'));
      return;
    }

    const newUser = {
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: password.trim(),
      instagram: regInstagram.trim()
    };

    const list = getUsers();
    list.push(newUser);
    saveUsers(list);
    saveCurrentUser(newUser);
    window.location.reload();
  };

  const recover = () => {
    const u = findUserByLogin(recoveryPhone.trim());
    if (!u) {
      alert(t('user_not_found'));
      return;
    }
    setFoundPass(u.password);
  };

  // UI ----------------------------------------------------------------------

  return (
    <div className="card" style={{ padding: 20 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <button
          onClick={() => setMode('login')}
          style={{
            ...auroraButton,
            background: mode === 'login'
              ? 'linear-gradient(135deg,#7b36ff,#4a007a)'
              : 'rgba(50,0,80,0.4)',
            width: '50%'
          }}
        >
          Вход
        </button>

        <button
          onClick={() => setMode('register')}
          style={{
            ...auroraButton,
            background: mode === 'register'
              ? 'linear-gradient(135deg,#7b36ff,#4a007a)'
              : 'rgba(50,0,80,0.4)',
            width: '50%'
          }}
        >
          Регистрация
        </button>
      </div>

      {/* LOGIN */}
      {mode === 'login' && (
        <>
          <label>Телефон или Email</label>
          <input
            style={auroraField}
            placeholder="+3706... / email"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />

          <label style={{ marginTop: 10 }}>Пароль</label>
          <input
            style={auroraField}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button style={auroraButton} onClick={loginHandler}>
            Вход
          </button>

          <div
            style={{ marginTop: 10, cursor: 'pointer', opacity: 0.8 }}
            onClick={() => setRecoveryOpen(true)}
          >
            forgot_password
          </div>
        </>
      )}

      {/* REGISTER */}
      {mode === 'register' && (
        <>
          <label>Имя</label>
          <input style={auroraField} value={regName} onChange={e => setRegName(e.target.value)} />

          <label style={{ marginTop: 10 }}>Телефон</label>
          <input style={auroraField} value={regPhone} onChange={e => setRegPhone(e.target.value)} />

          <label style={{ marginTop: 10 }}>Email</label>
          <input style={auroraField} value={regEmail} onChange={e => setRegEmail(e.target.value)} />

          <label style={{ marginTop: 10 }}>Instagram (необязательно)</label>
          <input style={auroraField} value={regInstagram} onChange={e => setRegInstagram(e.target.value)} />

          <label style={{ marginTop: 10 }}>Пароль</label>
          <input type="password" style={auroraField} value={password} onChange={e => setPassword(e.target.value)} />

          <button style={auroraButton} onClick={registerHandler}>
            Зарегистрироваться
          </button>
        </>
      )}

      {/* RECOVERY */}
      {recoveryOpen && (
        <div style={{ marginTop: 20 }}>
          <label>Телефон или Email</label>
          <input
            style={auroraField}
            value={recoveryPhone}
            onChange={e => setRecoveryPhone(e.target.value)}
          />

          <button style={auroraButton} onClick={recover}>Восстановить</button>

          {foundPass && (
            <div style={{ marginTop: 10, color: '#fff', fontSize: 18 }}>
              Ваш пароль: <b>{foundPass}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
