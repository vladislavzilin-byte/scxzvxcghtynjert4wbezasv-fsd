import { useState } from 'react'
import { getUsers, saveUsers, setCurrentUser, getCurrentUser } from '../lib/storage'
import { useI18n } from '../lib/i18n'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function Auth({ onAuth }) {
  const { t } = useI18n()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [identifier, setIdentifier] = useState('')

  // recovery state
  const [recoverOpen, setRecoverOpen] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const users = getUsers()

    if (mode === 'register') {
      if (!name || !phone || !password) return alert('Заполните все поля')
      if (users.find((u) => u.phone === phone)) return alert('Такой номер уже зарегистрирован')

      const user = { name, instagram, phone, email, password }
      users.push(user)
      saveUsers(users)
      setCurrentUser(user)
      onAuth?.(user)
      return
    }

    // LOGIN
    const id = identifier.trim()
    const user = users.find(
      (u) => (u.phone === id || u.email === id) && u.password === password
    )

    if (!user) {
      setRecoverOpen(true)
      return alert('Неверный логин или пароль')
    }

    setCurrentUser(user)
    onAuth?.(user)
  }

  const logout = () => {
    setCurrentUser(null)
    onAuth?.(null)
  }

  const current = getCurrentUser()

  // ✅ Logged-in view
  if (current) {
    return (
      <div
        style={{
          backdropFilter: 'blur(18px)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '18px',
          padding: '20px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{current.name}</div>
            <div style={{ opacity: 0.8 }}>📞 {current.phone}</div>
            {current.email && <div style={{ opacity: 0.8 }}>✉️ {current.email}</div>}
            {current.instagram && <div style={{ opacity: 0.8 }}>📸 {current.instagram}</div>}
          </div>

          <button
            onClick={logout}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    )
  }

  // ✅ Login + Register
  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button className={mode === 'login' ? '' : 'ghost'} onClick={() => setMode('login')}>
            {t('login')}
          </button>
          <button className={mode === 'register' ? '' : 'ghost'} onClick={() => setMode('register')}>
            {t('register')}
          </button>
        </div>

        <form onSubmit={submit} className="row">
          {mode === 'register' && (
            <>
              <div className="col">
                <label>{t('name')}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Inga" />
              </div>

              <div className="col">
                <label>{t('instagram')}</label>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="col">
                <label>{t('email_opt')}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="col">
                <label>{t('phone')}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+3706..."
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="col">
              <label>{t('phone_or_email')}</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+3706... / email"
              />
            </div>
          )}

          <div className="col">
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="col" style={{ alignSelf: 'end' }}>
            <button type="submit">{mode === 'login' ? t('login') : t('register')}</button>
          </div>
        </form>
      </div>

      <ForgotPasswordModal open={recoverOpen} onClose={() => setRecoverOpen(false)} />
    </>
  )
}
