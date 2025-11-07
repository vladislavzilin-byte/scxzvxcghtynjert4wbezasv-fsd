import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';

import {
  getUsers,
  saveUsers,
  findUserByPhone,
  findUserByEmail,
  findUserByLogin,
  getCurrentUser,
  setCurrentUser,
  logoutUser
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');

  const [foundPass, setFoundPass] = useState(null);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const user = getCurrentUser();

  // ───────────────────────────────
  // LOGIN
  // ───────────────────────────────
  const doLogin = () => {
    const u = findUserByLogin(login.trim());
    if (!u || u.password !== password.trim()) {
      setRecoveryOpen(true);   // ✅ включаем окно восстановления
      return;
    }
    setCurrentUser(u);
  };

  // ───────────────────────────────
  // REGISTER
  // ───────────────────────────────
  const doRegister = () => {
    if (!regName || !regPhone || !regEmail || !password) {
      alert('Заполните все поля');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.phone === regPhone)) {
      alert('Этот номер уже зарегистрирован');
      return;
    }
    if (users.some(u => u.email === regEmail)) {
      alert('Этот email уже зарегистрирован');
      return;
    }

    const newUser = {
      name: regName,
      phone: regPhone,
      email: regEmail,
      instagram: regInstagram,
      password,
    };

    saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    alert('Регистрация прошла успешно!');
  };

  // ───────────────────────────────
  // LOGOUT
  // ───────────────────────────────
  const logout = () => setCurrentUser(null);

  // ───────────────────────────────
  // RECOVERY (по телефону)
  // ───────────────────────────────
  const searchPass = () => {
    const u = findUserByPhone(recoveryPhone.trim());
    if (!u) {
      setFoundPass('Пользователь не найден');
      return;
    }
    setFoundPass(u.password); // ✅ показываем пароль
  };

  // ───────────────────────────────
  // UI
  // ───────────────────────────────

  if (user) {
    return (
      <div className="logoutCard">
        <div className="logoutRow">
          <div className="avatar">{user.name.slice(0,2).toUpperCase()}</div>
          <div className="infoCol">
            <b>{user.name}</b>
            <div>{user.phone}</div>
            <div>{user.instagram && '@'+user.instagram}</div>
            <div>{user.email}</div>
          </div>
          <button className="logoutBtn" onClick={logout}>
            {t('logout')}
          </button>
        </div>
      </div>
    );
  }

  // ───────────────────────────────
  // LOGIN / REGISTER SCREEN
  // ───────────────────────────────

  return (
    <div className="authCard">
      <div className="tabRow">
        <button className={mode==='login'?'tabActive':''} onClick={()=>setMode('login')}>
          Вход
        </button>
        <button className={mode==='register'?'tabActive':''} onClick={()=>setMode('register')}>
          Регистрация
        </button>
      </div>

      {mode === 'login' && (
        <>
          <label>Телефон или Email</label>
          <input value={login} onChange={e=>setLogin(e.target.value)} />

          <label>Пароль</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <button className="submitBtn" onClick={doLogin}>Вход</button>
        </>
      )}

      {mode === 'register' && (
        <>
          <label>Имя</label>
          <input value={regName} onChange={e=>setRegName(e.target.value)} />

          <label>Телефон</label>
          <input value={regPhone} onChange={e=>setRegPhone(e.target.value)} />

          <label>Email</label>
          <input value={regEmail} onChange={e=>setRegEmail(e.target.value)} />

          <label>Instagram</label>
          <input value={regInstagram} onChange={e=>setRegInstagram(e.target.value)} />

          <label>Пароль</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <button className="submitBtn" onClick={doRegister}>Зарегистрироваться</button>
        </>
      )}

      {/* ──────────────── RECOVERY MODAL ──────────────── */}
      {recoveryOpen && (
        <div className="modal-backdrop" onClick={() => setRecoveryOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Восстановление пароля</h3>

            <label>Введите телефон</label>
            <input
              value={recoveryPhone}
              onChange={e=>setRecoveryPhone(e.target.value)}
            />

            <button onClick={searchPass}>Найти</button>

            {foundPass && (
              <div className="passBox">
                Ваш пароль: <b>{foundPass}</b>
              </div>
            )}

            <button onClick={()=>setRecoveryOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
