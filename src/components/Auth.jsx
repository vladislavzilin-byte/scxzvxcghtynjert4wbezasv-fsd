import React, { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { getUser, loginUser, logoutUser, findUserByPhone } from '../utils/storage';

export default function Auth() {
  const { t } = useTranslation();
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
      alert(t('wrong'));
    }
  };

  const doLogout = () => {
    logoutUser();
    setCurrent(null);
  };

  const recover = () => {
    const u = findUserByPhone(recoveryPhone.trim());
    if (!u) {
      alert(t('not_found'));
      return;
    }
    setFoundPass(u.password);
  };

  // ░░░ ПРОФИЛЬ ░░░
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
            background: 'rgba(17, 0, 40, 0.55)',
            border: '1px solid rgba(168,85,247,0.35)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 32px rgba(120,0,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          {/* АВАТАР */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #6d28d9, #8b5cf6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '22px',
              fontWeight: '700',
              color: 'white',
              textShadow: '0 0 4px black',
            }}
          >
            {initials}
          </div>

          {/* ДАННЫЕ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: 'white',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {current.name}
            </div>

            {/* PHONE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#ddd' }}>
              <span style={{ fontSize: '17px' }}>📞</span> {current.phone}
            </div>

            {/* INSTAGRAM */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#ddd' }}>
              <span style={{ fontSize: '17px' }}>📸</span> {current.instagram || '-'}
            </div>

            {/* EMAIL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#ddd' }}>
              <span style={{ fontSize: '17px' }}>📧</span> {current.email}
            </div>
          </div>

          {/* ВЫЙТИ — СПРАВА */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              onClick={doLogout}
              style={{
                padding: '7px 14px',
                width: '50%',
                borderRadius: '12px',
                border: '1px solid rgba(168,85,247,0.55)',
                background: 'rgba(168,85,247,0.15)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: '0.25s',
                backdropFilter: 'blur(6px)',
                whiteSpace: 'nowrap',
              }}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ░░░ ФОРМА ВХОДА ░░░
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '18px' }}>
        {t('login')}
      </div>

      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder={t('phone')}
        style={{
          width: '260px',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: '10px',
        }}
      />

      <br />

      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={t('password')}
        type="password"
        style={{
          width: '260px',
          padding: '10px',
          borderRadius: '10px',
        }}
      />

      <br />

      <button
        onClick={tryLogin}
        style={{
          marginTop: '14px',
          padding: '10px 20px',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
      >
        {t('login')}
      </button>

      {/* ░░░ ОКНО ВОССТАНОВЛЕНИЯ ░░░ */}
      {showRecovery && (
        <div
          style={{
            marginTop: '30px',
            padding: '22px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(150,150,150,0.3)',
            width: '300px',
            marginInline: 'auto',
          }}
        >
          <div style={{ marginBottom: '12px', fontSize: '20px', fontWeight: '600' }}>
            {t('recovery')}
          </div>

          <input
            value={recoveryPhone}
            onChange={e => setRecoveryPhone(e.target.value)}
            placeholder={t('phone')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          />

          <button
            onClick={recover}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            {t('find')}
          </button>

          {foundPass && (
            <div style={{ fontSize: '18px', marginTop: '10px' }}>
              {t('your_password')}: <b>{foundPass}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
