import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';

import {
  loginUser,
  registerUser,
  findUserByEmail,
  findUserByPhone,
  getCurrentUser,
  logoutUser
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  const [mode, setMode] = useState('login'); // login / register
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({
    name: '',
    instagram: '',
    phone: '',
    email: '',
    password: ''
  });

  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverPhone, setRecoverPhone] = useState('');
  const [recoverResult, setRecoverResult] = useState(null);

  const user = getCurrentUser();

  // --------------------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------------------
  const handleLogin = () => {
    if (!phoneOrEmail.trim() || !password.trim()) {
      alert('Введите данные');
      return;
    }

    // ✅ ИЩЕМ ТОЛЬКО ПО phone + email
    const found =
      findUserByPhone(phoneOrEmail.trim()) ||
      findUserByEmail(phoneOrEmail.trim());

    if (!found) {
      setRecoverOpen(true);
      return alert('Неверный телефон/email или пароль');
    }

    if (found.password !== password) {
      setRecoverOpen(true);
      return alert('Неверный телефон/email или пароль');
    }

    loginUser(found);
    window.location.reload();
  };

  // --------------------------------------------------------------------
  // REGISTER
  // --------------------------------------------------------------------
  const handleRegister = () => {
    const { name, instagram, phone, email, password } = regData;

    if (!name || !phone || !email || !password) {
      alert('Заполните все поля');
      return;
    }

    if (findUserByPhone(phone) || findUserByEmail(email)) {
      return alert('Пользователь уже существует');
    }

    registerUser({
      name,
      instagram,
      phone,
      email,
      password
    });

    alert('Регистрация успешно выполнена!');
    setMode('login');
  };

  // --------------------------------------------------------------------
  // RECOVERY
  // --------------------------------------------------------------------
  const handleRecover = () => {
    const u = findUserByPhone(recoverPhone.trim());
    if (!u) {
      setRecoverResult('Пользователь не найден');
      return;
    }
    setRecoverResult(`Ваш пароль: ${u.password}`);
  };

  // --------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };

  // --------------------------------------------------------------------
  // UI: USER LOGGED IN PANEL
  // --------------------------------------------------------------------
  if (user) {
    const initials =
      (user.name?.[0] || '') + (user.name?.split(' ')[1]?.[0] || '');

    return (
      <div
        style={{
          margin: '20px auto',
          padding: '26px 32px',
          width: '95%',
          borderRadius: 22,
          border: '1px solid rgba(168,85,247,0.35)',
          background: 'linear-gradient(135deg, rgba(35,0,70,0.55), rgba(10,0,25,0.65))',
          boxShadow: '0 0 25px rgba(140,0,255,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* ICON */}
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'rgba(86,0,150,0.55)',
              border: '1px solid rgba(168,85,247,0.45)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: 20,
              color: '#fff',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px rgba(138,43,226,0.3)',
            }}
          >
            {initials}
          </div>

          {/* INFO */}
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
              {user.name}
            </div>

            <div style={{ marginTop: 4, color: '#bbb', display: 'flex', gap: 12, fontSize: 15 }}>
              <span>📞 {user.phone}</span>
              <span>📸 {user.instagram}</span>
              <span>📧 {user.email}</span>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 18px',
              fontSize: '0.9rem',
              borderRadius: 12,
              border: '1px solid rgba(168,85,247,0.45)',
              background: 'rgba(100,0,190,0.35)',
              color: '#fff',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              width: '40%',
              transition: '0.2s',
            }}
          >
            Выйти
          </button>

        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------
  // MAIN AUTH WINDOW
  // --------------------------------------------------------------------
  return (
    <div style={{ width: '95%', margin: '20px auto' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* TAB LOGIN */}
        <div
          onClick={() => setMode('login')}
          style={{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            borderRadius: 14,
            cursor: 'pointer',
            background:
              mode === 'login'
                ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Вход
        </div>

        {/* TAB REGISTER */}
        <div
          onClick={() => setMode('register')}
          style={{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            borderRadius: 14,
            cursor: 'pointer',
            background:
              mode === 'register'
                ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Регистрация
        </div>
      </div>

      {/* ─────────────────────────────── */}
      {/* LOGIN FORM */}
      {/* ─────────────────────────────── */}

      {mode === 'login' && (
        <div style={{ marginTop: 20 }}>
          <label style={{ color: '#fff' }}>Телефон или Email</label>
          <input
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="Введите телефон или email"
            className="input"
          />

          <label style={{ color: '#fff', marginTop: 12 }}>Пароль</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Введите пароль"
            className="input"
          />

          <button className="primary-btn" onClick={handleLogin}>
            Вход
          </button>

          <div
            style={{
              marginTop: 10,
              color: '#aaa',
              cursor: 'pointer',
              fontSize: 14
            }}
            onClick={() => setRecoverOpen(true)}
          >
            Забыли пароль?
          </div>
        </div>
      )}

      {/* ─────────────────────────────── */}
      {/* REGISTER FORM */}
      {/* ─────────────────────────────── */}

      {mode === 'register' && (
        <div style={{ marginTop: 20 }}>
          <label style={{ color: '#fff' }}>Имя</label>
          <input
            value={regData.name}
            onChange={(e) => setRegData({ ...regData, name: e.target.value })}
            className="input"
          />

          <label style={{ color: '#fff', marginTop: 12 }}>Instagram</label>
          <input
            value={regData.instagram}
            onChange={(e) =>
              setRegData({ ...regData, instagram: e.target.value })
            }
            className="input"
          />

          <label style={{ color: '#fff', marginTop: 12 }}>Телефон</label>
          <input
            value={regData.phone}
            onChange={(e) =>
              setRegData({ ...regData, phone: e.target.value })
            }
            className="input"
          />

          <label style={{ color: '#fff', marginTop: 12 }}>Email</label>
          <input
            value={regData.email}
            onChange={(e) =>
              setRegData({ ...regData, email: e.target.value })
            }
            className="input"
          />

          <label style={{ color: '#fff', marginTop: 12 }}>Пароль</label>
          <input
            value={regData.password}
            onChange={(e) =>
              setRegData({ ...regData, password: e.target.value })
            }
            type="password"
            className="input"
          />

          <button className="primary-btn" onClick={handleRegister}>
            Зарегистрироваться
          </button>
        </div>
      )}

      {/* ─────────────────────────────── */}
      {/* RECOVERY MODAL */}
      {/* ─────────────────────────────── */}

      {recoverOpen && (
        <div className="modal-backdrop" onClick={() => setRecoverOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Восстановление пароля</h3>

            <label>Введите телефон</label>
            <input
              value={recoverPhone}
              onChange={(e) => setRecoverPhone(e.target.value)}
              className="input"
              placeholder="+37060000000"
            />

            <button
              className="primary-btn"
              style={{ marginTop: 12 }}
              onClick={handleRecover}
            >
              Найти
            </button>

            {recoverResult && (
              <div style={{ marginTop: 14, color: '#fff' }}>
                {recoverResult}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
