import React, { useState } from 'react';
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
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  const [mode, setMode] = useState('login'); // login | register
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');

  // Recovery
  const [foundPass, setFoundPass] = useState(null);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const user = getCurrentUser();

  // --------------------------
  // LOGIN
  // --------------------------
  const handleLogin = () => {
    if (!login || !password) return alert(t('fill_all'));

    const found = findUserByLogin(login);
    if (!found)
      return alert(t('user_not_found'));

    if (found.password !== password)
      return alert(t('wrong_password'));

    saveCurrentUser(found);
    window.location.reload();
  };

  // --------------------------
  // REGISTER
  // --------------------------
  const handleRegister = () => {
    if (!regName || !regPhone || !regEmail || !password)
      return alert(t('fill_all'));

    const existsPhone = findUserByPhone(regPhone);
    const existsMail = findUserByEmail(regEmail);

    if (existsPhone) return alert(t('phone_exists'));
    if (existsMail) return alert(t('email_exists'));

    const newUser = {
      name: regName,
      phone: regPhone,
      email: regEmail,
      instagram: regInstagram,
      password
    };

    saveUsers([...getUsers(), newUser]);
    saveCurrentUser(newUser);

    window.location.reload();
  };

  // --------------------------
  // PASSWORD RECOVERY
  // --------------------------
  const handleRecovery = () => {
    const found = findUserByPhone(recoveryPhone);
    if (!found) {
      setFoundPass(null);
      return alert(t('user_not_found'));
    }
    setFoundPass(found.password);
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };

  // --------------------------
  // UI
  // --------------------------
  if (user) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h2>{user.name}</h2>
        <p>{user.phone}</p>
        <p>{user.email}</p>
        {user.instagram && <p>@{user.instagram}</p>}
        <button onClick={handleLogout} className="ok" style={{ marginTop: 10 }}>
          {t('logout')}
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20 }}>

      {/* SWITCH TABS */}
      <div style={{ display: 'flex', marginBottom: 20, gap: 10 }}>
        <button
          className={mode === 'login' ? 'ok' : 'ghost'}
          style={{ flex: 1 }}
          onClick={() => setMode('login')}
        >
          {t('login')}
        </button>
        <button
          className={mode === 'register' ? 'ok' : 'ghost'}
          style={{ flex: 1 }}
          onClick={() => setMode('register')}
        >
          {t('register')}
        </button>
      </div>

      {mode === 'login' && (
        <div>
          <label>{t('phone_or_email')}</label>
          <input
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="+37060000000 / email"
          />

          <label>{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={handleLogin} className="ok" style={{ marginTop: 10 }}>
            {t('login')}
          </button>

          <div style={{ marginTop: 10 }}>
            <small
              className="muted"
              style={{ cursor: 'pointer' }}
              onClick={() => setRecoveryOpen(true)}
            >
              {t('forgot_password')}
            </small>
          </div>
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label>{t('name')}</label>
          <input value={regName} onChange={e => setRegName(e.target.value)} />

          <label>{t('phone')}</label>
          <input value={regPhone} onChange={e => setRegPhone(e.target.value)} />

          <label>Email</label>
          <input value={regEmail} onChange={e => setRegEmail(e.target.value)} />

          <label>Instagram</label>
          <input value={regInstagram} onChange={e => setRegInstagram(e.target.value)} />

          <label>{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={handleRegister} className="ok" style={{ marginTop: 10 }}>
            {t('register')}
          </button>
        </div>
      )}

      {/* PASSWORD RECOVERY MODAL */}
      {recoveryOpen && (
        <div className="modal-backdrop" onClick={() => setRecoveryOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{t('password_recovery')}</h3>

            <label>{t('enter_phone')}</label>
            <input
              value={recoveryPhone}
              onChange={e => setRecoveryPhone(e.target.value)}
              placeholder="+37060000000"
            />

            <button onClick={handleRecovery} className="ok" style={{ marginTop: 10 }}>
              {t('find')}
            </button>

            {foundPass && (
              <div style={{ marginTop: 10 }}>
                <b>{t('your_password')}:</b> {foundPass}
              </div>
            )}

            <button
              onClick={() => setRecoveryOpen(false)}
              className="ghost"
              style={{ marginTop: 15 }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
