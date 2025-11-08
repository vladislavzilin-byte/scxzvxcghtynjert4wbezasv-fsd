import { useState } from 'react'
import { getUsers, saveUsers, setCurrentUser, getCurrentUser } from '../lib/storage'
import { useI18n } from '../lib/i18n'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function Auth() {
  const { t } = useI18n()
  const [mode, setMode] = useState('login')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regInstagram, setRegInstagram] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [foundPass, setFoundPass] = useState(null)
  const [recoveryPhone, setRecoveryPhone] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const user = getCurrentUser()

  // гарантируем, что админы есть
  useEffect(() => {
    try { ensureDefaultAdmins() } catch (e) {}
  }, [])

  // LOGIN
  const doLogin = () => {
    const u = findUserByLogin(login.trim())
    if (!u) return alert('Пользователь не найден')
    if (u.password !== password) return alert('Неверный пароль')
    saveCurrentUser(u)
    window.location.reload()
  }

  // REGISTER
  const doRegister = () => {
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      alert('Заполните все поля')
      return
    }
    if (findUserByPhone(regPhone.trim())) return alert('Телефон уже зарегистрирован')
    if (regEmail.trim() && findUserByEmail(regEmail.trim()))
      return alert('Email уже зарегистрирован')

    const newUser = {
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      instagram: regInstagram.trim(),
      password: regPassword.trim(),
      isAdmin: false,
    }
    const users = getUsers()
    users.push(newUser)
    saveUsers(users)
    saveCurrentUser(newUser)
    window.location.reload()
  }

  // RECOVERY
  const doRecover = () => {
    const u = findUserByPhone(recoveryPhone.trim())
    if (!u) return alert('Пользователь не найден')
    setFoundPass(u.password)
  }

  // LOGOUT
  const doLogout = () => {
    logoutUser()
    window.location.reload()
  }

  // ---------- UI ----------
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(15,0,40,0.5)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: '0.25s',
    marginBottom: '10px',
  }

  const btnPrimary = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(168,85,247,0.6)',
    background: 'linear-gradient(135deg, rgba(120,0,255,0.6), rgba(70,0,150,0.6))',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: '0.25s',
    marginTop: '10px',
  }

  const btnSecondary = {
    ...btnPrimary,
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.4)',
    marginTop: '15px',
  }

  return (
    <div
      style={{
        background: 'rgba(20,0,50,0.6)',
        borderRadius: '18px',
        border: '1px solid rgba(168,85,247,0.25)',
        boxShadow: '0 0 25px rgba(138,43,226,0.25)',
        padding: '25px 22px',
        color: '#fff',
        maxWidth: 360,
        margin: '0 auto',
        backdropFilter: 'blur(10px)',
      }}
    >
      {!user && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
            <button
              onClick={() => setMode('login')}
              style={{
                ...btnSecondary,
                width: '45%',
                background: mode === 'login'
                  ? 'linear-gradient(135deg, rgba(120,0,255,0.6), rgba(70,0,150,0.6))'
                  : 'rgba(168,85,247,0.12)',
                border: '1px solid rgba(168,85,247,0.4)',
              }}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('register')}
              style={{
                ...btnSecondary,
                width: '45%',
                background: mode === 'register'
                  ? 'linear-gradient(135deg, rgba(120,0,255,0.6), rgba(70,0,150,0.6))'
                  : 'rgba(168,85,247,0.12)',
                border: '1px solid rgba(168,85,247,0.4)',
              }}
            >
              Регистрация
            </button>
          </div>

          {mode === 'login' && (
            <>
              <input
                style={inputStyle}
                placeholder="Телефон или Email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button style={btnPrimary} onClick={doLogin}>
                Войти
              </button>

              <div
                style={{
                  marginTop: 14,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                onClick={() => setRecoveryOpen(!recoveryOpen)}
              >
                Забыли пароль?
              </div>

              {recoveryOpen && (
                <div style={{ marginTop: 12 }}>
                  <input
                    style={inputStyle}
                    placeholder="Введите телефон"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                  />
                  <button style={btnSecondary} onClick={doRecover}>
                    Восстановить
                  </button>
                  {foundPass && (
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                      Ваш пароль: <b>{foundPass}</b>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {mode === 'register' && (
            <>
              <input
                style={inputStyle}
                placeholder="Имя"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Телефон"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Instagram"
                value={regInstagram}
                onChange={(e) => setRegInstagram(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Пароль"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button style={btnPrimary} onClick={doRegister}>
                Зарегистрироваться
              </button>
            </>
          )}
        </>
      )}

      {user && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {user.name || 'Профиль'}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {user.phone} {user.email && `• ${user.email}`}
          </div>
          <button style={btnSecondary} onClick={doLogout}>
            Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  )
}
