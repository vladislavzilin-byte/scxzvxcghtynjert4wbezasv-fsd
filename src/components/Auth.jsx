import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import {
  loginUser,
  registerUser,
  findUserByEmail,
  findUserByLogin,
  getCurrentUser
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  // UI state
  const [mode, setMode] = useState('login'); // login | register
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Recovery
  const [showRecover, setShowRecover] = useState(false);
  const [recoverPhone, setRecoverPhone] = useState('');
  const [recoveredPass, setRecoveredPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  const doLogin = () => {
    if (!phoneOrEmail.trim() || !password.trim()) {
      alert(t('fill_all_fields'));
      return;
    }

    const user =
      findUserByLogin(phoneOrEmail.trim()) ||
      findUserByEmail(phoneOrEmail.trim());

    if (!user) {
      alert(t('wrong_login_or_pass'));
      return;
    }

    if (user.password !== password.trim()) {
      alert(t('wrong_login_or_pass'));
      return;
    }

    loginUser(user.id);
    window.location.reload();
  };

  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------
  const doRegister = () => {
    if (!regName || !regPhone || !regEmail || !regPassword) {
      alert(t('fill_all_fields'));
      return;
    }

    registerUser({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
    });

    alert(t('register_success'));
    setMode('login');
  };

  // ---------------------------------------------------------
  // RECOVER PASSWORD (BY PHONE)
  // ---------------------------------------------------------
  const doRecover = () => {
    const user = findUserByLogin(recoverPhone.trim());

    if (!user) {
      alert('Номер не найден');
      return;
    }

    setRecoveredPass(user.password);
  };

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const currentUser = getCurrentUser();

  // ---------------------------------------------------------
  // STYLES (Aurora UI)
  // ---------------------------------------------------------
  const fieldStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(168,85,247,0.45)',
    background: 'rgba(20,0,40,0.45)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '12px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7b2ff7, #4b00e0)',
    border: '1px solid rgba(168,85,247,0.4)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 0 14px rgba(138,43,226,0.25)',
  };

  const smallBtn = {
    ...buttonStyle,
    width: '50%',
    padding: '10px',
    fontSize: '13px',
  };

  // ---------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------

  // ✅ Already logged in → show profile header
  if (currentUser) {
    return (
      <div
        style={{
          marginTop: 20,
          padding: 24,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(40,0,80,0.45), rgba(15,0,35,0.55))',
          border: '1px solid rgba(168,85,247,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'rgba(66,0,145,0.5)',
            border: '1px solid rgba(168,85,247,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 20,
            color: '#fff',
            backdropFilter: 'blur(6px)',
          }}
        >
          {currentUser.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700 }}>{currentUser.name}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>📞 {currentUser.phone}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>📧 {currentUser.email}</div>
          {currentUser.instagram && (
            <div style={{ fontSize: 14, opacity: 0.8 }}>📸 {currentUser.instagram}</div>
          )}
        </div>

        {/* Logout */}
        <button onClick={logout} style={smallBtn}>
          {t('logout')}
        </button>
      </div>
    );
  }

  // ✅ Not logged in → show login screen
  return (
    <div style={{ marginTop: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          style={{
            ...buttonStyle,
            background: mode === 'login'
              ? 'linear-gradient(135deg, #7b2ff7, #4b00e0)'
              : 'rgba(20,0,40,0.45)',
            width: '50%',
          }}
          onClick={() => setMode('login')}
        >
          {t('login')}
        </button>

        <button
          style={{
            ...buttonStyle,
            background: mode === 'register'
              ? 'linear-gradient(135deg, #7b2ff7, #4b00e0)'
              : 'rgba(20,0,40,0.45)',
            width: '50%',
          }}
          onClick={() => setMode('register')}
        >
          {t('register')}
        </button>
      </div>

      {/* Login form */}
      {mode === 'login' && (
        <div style={{ marginTop: 20 }}>
          <input
            placeholder="Телефон или Email"
            style={fieldStyle}
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            style={fieldStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={buttonStyle} onClick={doLogin}>
            {t('login')}
          </button>

          <div
            style={{
              marginTop: 10,
              textAlign: 'center',
              cursor: 'pointer',
              opacity: 0.8,
            }}
            onClick={() => setShowRecover(true)}
          >
            Забыли пароль?
          </div>
        </div>
      )}

      {/* Register form */}
      {mode === 'register' && (
        <div style={{ marginTop: 20 }}>
          <input
            placeholder="Имя"
            style={fieldStyle}
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />

          <input
            placeholder="Телефон"
            style={fieldStyle}
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
          />

          <input
            placeholder="Email"
            style={fieldStyle}
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            style={fieldStyle}
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />

          <button style={buttonStyle} onClick={doRegister}>
            {t('register')}
          </button>
        </div>
      )}

      {/* Recover modal */}
      {showRecover && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowRecover(false)}
        >
          <div
            style={{
              width: 320,
              padding: 24,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(40,0,80,0.65), rgba(20,0,50,0.65))',
              border: '1px solid rgba(168,85,247,0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Восстановление пароля</h3>

            <input
              placeholder="Введите телефон"
              style={fieldStyle}
              value={recoverPhone}
              onChange={(e) => setRecoverPhone(e.target.value)}
            />

            <button style={buttonStyle} onClick={doRecover}>
              Найти
            </button>

            {recoveredPass && (
              <div style={{ marginTop: 16 }}>
                <div style={{ opacity: 0.8, marginBottom: 6 }}>Ваш пароль:</div>

                <input
                  style={fieldStyle}
                  type={showPass ? 'text' : 'password'}
                  value={recoveredPass}
                  readOnly
                />

                <button
                  style={buttonStyle}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
