import React, { useState } from 'react'
import { useI18n } from '../lib/i18n'
import {
  loginUser,
  registerUser,
  findUserByPhone,
  findUserByEmail,
  getCurrentUser
} from '../utils/storage'

export default function Auth() {
  const { t } = useI18n()

  const [mode, setMode] = useState('login')
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [recoverOpen, setRecoverOpen] = useState(false)
  const [recoverPhone, setRecoverPhone] = useState('')
  const [recoverPass, setRecoverPass] = useState(null)

  // ──────────────────────────────
  //      LOGIN / REGISTER
  // ──────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!phoneOrEmail.trim() || !password.trim()) {
      alert(t('fill_all'))
      return
    }

    if (mode === 'login') {
      const user =
        findUserByPhone(phoneOrEmail.trim()) ||
        findUserByEmail(phoneOrEmail.trim())

      if (!user) {
        // ✅ 3. Автопереход в регистрацию
        alert(t('no_account_switch_register'))
        setMode('register')
        return
      }

      const ok = loginUser(user.phone, password)
      if (!ok) {
        alert(t('wrong_login'))
        return
      }
      window.location.reload()
      return
    }

    if (mode === 'register') {
      const exists =
        findUserByPhone(phoneOrEmail.trim()) ||
        findUserByEmail(phoneOrEmail.trim())

      if (exists) {
        alert(t('already_exists'))
        return
      }

      registerUser({
        phone: phoneOrEmail.trim(),
        email: phoneOrEmail.trim().includes('@') ? phoneOrEmail.trim() : '',
        password
      })

      alert(t('registered_success'))
      setMode('login')
      return
    }
  }

  // ──────────────────────────────
  //       PASSWORD RECOVERY
  // ──────────────────────────────
  const openRecovery = () => {
    setRecoverPhone('')
    setRecoverPass(null)
    setRecoverOpen(true)
  }

  const handleRecovery = () => {
    const user = findUserByPhone(recoverPhone.trim())
    if (!user) {
      alert(t('user_not_found'))
      return
    }
    setRecoverPass(user.password)
  }

  // ──────────────────────────────
  //             UI
  // ──────────────────────────────
  const tabStyle = (active) => ({
    padding: '14px',
    textAlign: 'center',
    flex: 1,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: '0.3s',
    fontWeight: 600,
    background: active
      ? 'linear-gradient(90deg, rgba(120,45,245,0.55), rgba(90,20,200,0.50))'
      : 'rgba(255,255,255,0.05)',
    border: active
      ? '1px solid rgba(170,70,255,0.55)'
      : '1px solid rgba(255,255,255,0.07)',
    color: active ? '#fff' : '#bbb',
    backdropFilter: 'blur(10px)'
  })

  const inputStyle = {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  }

  return (
    <div className="card">

      {/* ─────────────── Tabs ─────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={tabStyle(mode === 'login')} onClick={() => setMode('login')}>
          {t('login')}
        </div>
        <div
          style={tabStyle(mode === 'register')}
          onClick={() => setMode('register')}
        >
          {t('register')}
        </div>
      </div>

      {/* ─────────────── FORM ─────────────── */}
      <form onSubmit={handleSubmit}>

        <label className="muted">{t('phone_or_email')}</label>
        <input
          style={inputStyle}
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
        />

        <label className="muted" style={{ marginTop: 12 }}>
          {t('password')}
        </label>

        {/* PASSWORD + SHOW BUTTON */}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ 1. Показать пароль */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#ccc',
              fontSize: 13
            }}
          >
            {showPassword ? t('hide') : t('show')}
          </span>
        </div>

        {/* ✅ 2. Забыли пароль? */}
        {mode === 'login' && (
          <div
            style={{
              marginTop: 6,
              textAlign: 'right',
              cursor: 'pointer',
              color: '#9f7fff',
              fontSize: 13
            }}
            onClick={openRecovery}
          >
            {t('forgot_password')}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            marginTop: 18,
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(90deg, #7b2ff7, #6a12d9)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 16
          }}
        >
          {t('login')}
        </button>
      </form>

      {/* ─────────────── RECOVERY MODAL ─────────────── */}
      {recoverOpen && (
        <div className="modal-backdrop" onClick={() => setRecoverOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: 'center' }}
          >
            <h3>{t('recover_title')}</h3>

            <input
              style={{ ...inputStyle, marginTop: 12 }}
              placeholder={t('enter_phone')}
              value={recoverPhone}
              onChange={(e) => setRecoverPhone(e.target.value)}
            />

            <button
              style={{ marginTop: 12, padding: '10px 18px' }}
              onClick={handleRecovery}
            >
              {t('find')}
            </button>

            {recoverPass && (
              <div style={{ marginTop: 14 }}>
                <b>{t('your_password')}:</b>
                <div style={{ marginTop: 8, fontSize: 20 }}>{recoverPass}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
