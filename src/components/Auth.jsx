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

  // ✅ LOGGED IN — PREMIUM PURPLE AURORA BLOCK
  if (current) {
  const initials = current.name
    ? current.name.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()
    : "U"

  return (
    <div
      style={{
        position: 'relative',
        padding: '26px',
        borderRadius: '22px',
        background: 'rgba(15, 6, 26, 0.55)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        boxShadow: '0 12px 45px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        marginBottom: '30px',
        fontFamily: 'Poppins, Inter, sans-serif'
      }}
    >
      {/* Aurora */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(900px 500px at -10% 120%, rgba(168,85,247,0.18), transparent 65%),' +
            'radial-gradient(700px 400px at 110% -20%, rgba(139,92,246,0.16), transparent 60%),' +
            'radial-gradient(800px 450px at 50% 120%, rgba(99,102,241,0.12), transparent 65%)',
          animation: 'auroraShift 12s ease-in-out infinite alternate'
        }}
      />

      {/* Border glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '22px',
          padding: '1.5px',
          background: 'linear-gradient(120deg, rgba(168,85,247,0.55), rgba(139,92,246,0.35), rgba(99,102,241,0.45))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          opacity: 0.7
        }}
      />

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>

        {/* LEFT */}
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>

          {/* Initials badge */}
          <div
            style={{
              minWidth: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(168,85,247,0.18)',
              border: '1px solid rgba(168,85,247,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              animation: 'avatarPulse 3.6s ease-in-out infinite'
            }}
          >
            {initials}
          </div>

          {/* User data */}
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                marginBottom: 3,
                background: 'linear-gradient(90deg, rgba(236,223,255,1), rgba(198,173,255,0.85))',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {current.name}
            </div>

            {/* Phone */}
            <div style={{ opacity:0.9, display:'flex', alignItems:'center', gap:6 }}>
              📞 <span>{current.phone}</span>
            </div>

            {/* Instagram ✅ возвращён */}
            {current.instagram && (
              <div style={{ opacity:0.85, display:'flex', alignItems:'center', gap:6 }}>
                📸 <span>{current.instagram}</span>
              </div>
            )}

            {/* Email */}
            {current.email && (
              <div style={{ opacity:0.85, display:'flex', alignItems:'center', gap:6 }}>
                ✉️ <span>{current.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — LOGOUT */}
       {/* RIGHT — LOGOUT */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // чтобы занял всё доступное по высоте
  }}
>
  <button
    onClick={logout}
    style={{
      padding: '6px 14px',
      fontSize: '0.85rem',
      borderRadius: '10px',
      border: '1px solid rgba(168,85,247,0.5)',
      background: 'rgba(168,85,247,0.12)',
      color: '#fff',
      cursor: 'pointer',
      transition: '0.25s',
      whiteSpace: 'nowrap',
      backdropFilter: 'blur(6px)',
      width: '50%',   // твои 50%
      textAlign: 'center',
    }}
  >
    {t('logout')}
  </button>
</div>


  // ✅ LOGIN + REGISTER
  return (
    <>
      <div className="card">
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
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
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Inga" />
              </div>

              <div className="col">
                <label>{t('instagram')}</label>
                <input value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="@username" />
              </div>

              <div className="col">
                <label>{t('email_opt')}</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" />
              </div>

              <div className="col">
                <label>{t('phone')}</label>
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+3706..." />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="col">
              <label>{t('phone_or_email')}</label>
              <input value={identifier} onChange={(e)=>setIdentifier(e.target.value)} placeholder="+3706... / email" />
            </div>
          )}

          <div className="col">
            <label>{t('password')}</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div className="col" style={{ alignSelf:'end' }}>
            <button type="submit">{mode === 'login' ? t('login') : t('register')}</button>
          </div>
        </form>
      </div>

      <ForgotPasswordModal open={recoverOpen} onClose={()=>setRecoverOpen(false)} />
    </>
  )
}
