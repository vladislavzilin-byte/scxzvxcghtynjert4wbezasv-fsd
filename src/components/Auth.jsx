import React, { useState } from 'react';
import { t } from '../lib/i18n'; 
import { getUser, loginUser, logoutUser, findUserByPhone } from '../utils/storage';

export default function Auth() {
  const [current, setCurrent] = useState(getUser());
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);
  const [foundPass, setFoundPass] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');

  const tryLogin = () => {
    const u = loginUser(phone, password);
    if (u) {
      setCurrent(u);
      setWrongCount(0);
    } else {
      const c = wrongCount + 1;
      setWrongCount(c);
      if (c >= 1) setShowRecovery(true);
      alert(t('wrong_login'));
    }
  };

  const doLogout = () => {
    logoutUser();
    setCurrent(null);
  };

  const recover = () => {
    const u = findUserByPhone(recoveryPhone.trim());
    if (!u) {
      alert(t('user_not_found'));
      return;
    }
    setFoundPass(u.password);
  };

  // ███████████  ПРОФИЛЬ  ███████████

  if (current) {
    const initials = (current.name || '?')
      .split(' ')
      .map(w => w[0]?.toUpperCase())
      .slice(0, 2)
      .join('');

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            width: '95%',
            maxWidth: '1150px',
            padding: '28px 34px',
            borderRadius: '22px',
            background: 'rgba(17,0,40,0.55)',
            border: '1px solid rgba(168,85,247,0.35)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 32px rgba(120,0,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          {/* Аватар */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(145deg,#6d28d9,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: 'white',
              fontWeight: '700',
            }}
          >
            {initials}
          </div>

          {/* Информация */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>
              {current.name}
            </div>

            <div style={{ color: '#ccc', fontSize: '15px' }}>📞 {current.phone}</div>

            {current.instagram && (
              <div style={{ color: '#ccc', fontSize: '15px' }}>
                📸 {current.instagram}
              </div>
            )}

            <div style={{ color: '#ccc', fontSize: '15px' }}>📧 {current.email}</div>
          </div>

          {/* Кнопка выйти */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={doLogout}
              style={{
                width: '40%',
                padding: '8px 10px',
                borderRadius: '12px',
                background: 'rgba(120,0,255,0.25)',
                border: '1px solid rgba(168,85,247,0.55)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ███████████  ФОРМА ВХОДА  ███████████

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>{t('login')}</h2>

      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder={t('phone')}
        style={{ padding: 10, width: 240, borderRadius: 10, marginBottom: 8 }}
      />

      <br />

      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={t('password')}
        type="password"
        style={{ padding: 10, width: 240, borderRadius: 10 }}
      />

      <br />

      <button
        onClick={tryLogin}
        style={{ marginTop: 14, padding: '10px 20px', borderRadius: 10 }}
      >
        {t('login')}
      </button>

      {/* █████ Окно восстановления █████ */}
      {showRecovery && (
        <div
          style={{
            marginTop: 30,
            padding: 22,
            borderRadius: 14,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            width: 280,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3>{t('restore_password')}</h3>

          <input
            value={recoveryPhone}
            onChange={e => setRecoveryPhone(e.target.value)}
            placeholder={t('phone')}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          <button
            onClick={recover}
            style={{
              padding: 8,
              width: '100%',
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            {t('find')}
          </button>

          {foundPass && (
            <div style={{ color: 'white', fontSize: 18 }}>
              {t('your_password')}: <b>{foundPass}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
