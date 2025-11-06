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
  const initials = current.name
    ? current.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : "U";

  // Premium avatar dynamic color generator
  const hue = (current.name.length * 37) % 360;

  return (
    <div
      style={{
        position: 'relative',
        padding: '28px',
        borderRadius: '22px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        boxShadow: '0 12px 45px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        marginBottom: '30px',
        animation: 'fadeInUp 0.6s ease'
      }}
    >

      {/* NEON GLOW BORDER */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '22px',
          padding: '2px',
          background: `linear-gradient(120deg,
            hsla(${hue}, 90%, 65%, 0.4),
            hsla(${(hue + 50) % 360}, 90%, 65%, 0.25),
            hsla(${(hue + 120) % 360}, 90%, 65%, 0.4)
          )`,
          WebkitMask: 
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          pointerEvents: 'none'
        }}
      />

      {/* CONTENT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* LEFT SIDE */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>

          {/* AVATAR */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: `linear-gradient(135deg,
                hsla(${hue}, 80%, 60%, 0.3),
                hsla(${hue}, 80%, 60%, 0.15)
              )`,
              border: `2px solid hsla(${hue}, 80%, 65%, 0.5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '1px',
              textShadow: '0 0 8px rgba(0,0,0,0.6)',
              animation: 'avatarFloat 4s ease-in-out infinite'
            }}
          >
            {initials}
          </div>

          {/* TEXT */}
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                background: `linear-gradient(90deg,
                  hsla(${hue}, 100%, 80%, 1),
                  hsla(${(hue + 60) % 360}, 95%, 75%, 0.9)
                )`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                marginBottom: 4
              }}
            >
              {current.name}
            </div>

            <div style={{ opacity: 0.85 }}>📞 {current.phone}</div>
            {current.email && <div style={{ opacity: 0.85 }}>✉️ {current.email}</div>}
            {current.instagram && <div style={{ opacity: 0.85 }}>📸 {current.instagram}</div>}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          style={{
            padding: '7px 12px',
            fontSize: '0.85rem',
            borderRadius: '12px',
            border: `1px solid hsla(${hue}, 90%, 75%, 0.5)`,
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            cursor: 'pointer',
            transition: '0.25s',
            backdropFilter: 'blur(6px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = `hsla(${hue}, 100%, 70%, 0.22)`
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.12)'
          }}
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
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
