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
  logoutUser,
  ensureDefaultAdmins,   // ✅ очень важно!
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  // ✅ Добавляем админов при загрузке
  useEffect(() => {
    try {
      ensureDefaultAdmins();
    } catch (e) {}
  }, []);

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [foundPass, setFoundPass] = useState(null);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const user = getCurrentUser();

  // ✅ LOGIN
  const doLogin = () => {
    const u = findUserByLogin(login.trim());

    if (!u) {
      alert('Пользователь не найден');
      return;
    }

    if (u.password !== password) {
      alert('Неверный пароль');
      return;
    }

    saveCurrentUser(u);
    window.location.reload();
  };

  // ✅ REGISTER
  const doRegister = () => {
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      alert('Заполните все поля');
      return;
    }

    const existsPhone = findUserByPhone(regPhone.trim());
    if (existsPhone) {
      alert('Этот телефон уже зарегистрирован');
      return;
    }

    let existsEmail = null;
    if (regEmail.trim()) {
      existsEmail = findUserByEmail(regEmail.trim());
      if (existsEmail) {
        alert('Этот email уже зарегистрирован');
        return;
      }
    }

    const newUser = {
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      instagram: regInstagram.trim(),
      password: regPassword.trim(),
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    saveCurrentUser(newUser);
    window.location.reload();
  };

  // ✅ PASSWORD RECOVERY
  const doRecover = () => {
    const u = findUserByPhone(recoveryPhone.trim());
    if (!u) {
      alert('Пользователь не найден');
      return;
    }
    setFoundPass(u.password);
  };

  // ✅ LOGOUT
  const doLogout = () => {
    logoutUser();
    window.location.reload();
  };

  return (
    <div className="card" style={{ padding: 20 }}>

      {/* SWITCH */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setMode('login')}
          className={mode === 'login' ? 'tab active' : 'tab'}
        >
          Вход
        </button>

        <button
          onClick={() => setMode('register')}
          className={mode === 'register' ? 'tab active' : 'tab'}
        >
          Регистрация
        </button>
      </div>

      {/* LOGIN FORM */}
      {mode === 'login' && (
        <>
          <label>Телефон или Email</label>
          <input
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="+3706... / email"
            className="input"
          />

          <label style={{ marginTop: 12 }}>Пароль</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="input"
          />

          <button className="primary-btn" onClick={doLogin}>
            Вход
          </button>

          <div
            style={{ marginTop: 10, cursor: 'pointer' }}
            onClick={() => setRecoveryOpen(!recoveryOpen)}
          >
            Забыли пароль?
          </div>

          {recoveryOpen && (
            <div style={{ marginTop: 15 }}>
              <input
                className="input"
                placeholder="Телефон"
                value={recoveryPhone}
                onChange={e => setRecoveryPhone(e.target.value)}
              />
              <button onClick={doRecover} className="secondary-btn" style={{ marginTop: 10 }}>
                Восстановить
              </button>
              {foundPass && (
                <div style={{ marginTop: 10 }}>
                  Ваш пароль: <b>{foundPass}</b>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* REGISTER FORM */}
      {mode === 'register' && (
        <>
          <label>Имя</label>
          <input className="input" value={regName} onChange={e => setRegName(e.target.value)} />

          <label style={{ marginTop: 10 }}>Телефон</label>
          <input className="input" value={regPhone} onChange={e => setRegPhone(e.target.value)} />

          <label style={{ marginTop: 10 }}>Email</label>
          <input className="input" value={regEmail} onChange={e => setRegEmail(e.target.value)} />

          <label style={{ marginTop: 10 }}>Instagram</label>
          <input
            className="input"
            value={regInstagram}
            onChange={e => setRegInstagram(e.target.value)}
          />

          <label style={{ marginTop: 10 }}>Пароль</label>
          <input
            className="input"
            type="password"
            value={regPassword}
            onChange={e => setRegPassword(e.target.value)}
          />

          <button className="primary-btn" style={{ marginTop: 15 }} onClick={doRegister}>
            Зарегистрироваться
          </button>
        </>
      )}

      {/* LOGOUT BUTTON */}
      {user && (
        <button className="secondary-btn" style={{ marginTop: 20 }} onClick={doLogout}>
          Выйти из аккаунта
        </button>
      )}
    </div>
  );
}
