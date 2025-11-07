import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';

import {
  getUsers,
  saveUsers,
  findUserByPhone,
  findUserByEmail,
  findUserByLogin,
  getCurrentUser,
  setCurrentUser,
  logoutUser
} from '../utils/storage';

export default function Auth() {
  const { t } = useI18n();

  // ✅ Авто-добавление администратора (Irina)
  useEffect(() => {
    const users = getUsers();
    const exists = users.find(u => u.email === "irina.abramova7@gmail.com");
    if (!exists) {
      users.push({
        name: "Irina Abramova",
        phone: "+00000000000",
        email: "irina.abramova7@gmail.com",
        password: "vladiokas",
        instagram: ""
      });
      saveUsers(users);
    }
  }, []);

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [foundPass, setFoundPass] = useState(null);

  const user = getCurrentUser();

  // ✅ LOGIN FUNCTION
  const doLogin = () => {
    const u = findUserByLogin(login.trim());
    if (!u) {
      alert("Неверный логин или пароль");
      return;
    }
    if (u.password !== password.trim()) {
      alert("Неверный пароль");
      return;
    }
    setCurrentUser(u);
    window.location.reload();
  };

  // ✅ REGISTER FUNCTION
  const doRegister = () => {
    if (!regName || !regPhone || !regEmail || !regPassword) {
      alert("Заполните все поля");
      return;
    }

    const existsPhone = findUserByPhone(regPhone.trim());
    const existsEmail = findUserByEmail(regEmail.trim());

    if (existsPhone || existsEmail) {
      alert("Пользователь уже существует");
      return;
    }

    const users = getUsers();
    users.push({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      instagram: regInstagram.trim(),
      password: regPassword.trim()
    });
    saveUsers(users);

    alert("Регистрация успешно завершена!");
    setMode('login');
  };

  // ✅ RECOVERY FUNCTION
  const doRecovery = () => {
    const user = findUserByPhone(recoveryPhone.trim());
    if (!user) {
      setFoundPass("Телефон не найден");
      return;
    }
    setFoundPass(user.password);
  };

  // ✅ LOGOUT
  const logout = () => {
    logoutUser();
    window.location.reload();
  };

  // ✅ AURORA STYLE (единый стиль для всего UI)
  const auroraInput = {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(20,0,40,0.55)",
    border: "1px solid rgba(168,85,247,0.35)",
    borderRadius: "14px",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    marginBottom: "14px",
  };

  const auroraButton = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #5b21b6, #7c3aed)",
    border: "1px solid rgba(168,85,247,0.45)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
    transition: "0.25s",
  };

  return (
    <div className="card" style={{ padding: 25 }}>

      {/* ✅ SWITCH LOGIN / REGISTER */}
      <div style={{
        display: "flex",
        marginBottom: 20,
        gap: 14
      }}>
        <div
          onClick={() => setMode("login")}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "14px",
            textAlign: "center",
            border: mode === "login"
              ? "2px solid rgba(168,85,247,0.55)"
              : "1px solid rgba(168,85,247,0.25)",
            background: mode === "login"
              ? "linear-gradient(90deg,#6d28d9,#8b5cf6)"
              : "rgba(20,0,40,0.55)",
            cursor: "pointer",
            color: "#fff"
          }}>Вход</div>

        <div
          onClick={() => setMode("register")}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "14px",
            textAlign: "center",
            border: mode === "register"
              ? "2px solid rgba(168,85,247,0.55)"
              : "1px solid rgba(168,85,247,0.25)",
            background: mode === "register"
              ? "linear-gradient(90deg,#6d28d9,#8b5cf6)"
              : "rgba(20,0,40,0.55)",
            cursor: "pointer",
            color: "#fff"
          }}>Регистрация</div>
      </div>

      {/* ✅ LOGIN FORM */}
      {mode === "login" && (
        <div>
          <input
            style={auroraInput}
            placeholder="+3706... / email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <input
            style={auroraInput}
            type="password"
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={auroraButton} onClick={doLogin}>Вход</button>

          <div
            style={{ marginTop: 14, color: "#aaa", cursor: "pointer" }}
            onClick={() => setRecoveryOpen(true)}
          >
            Забыли пароль?
          </div>
        </div>
      )}

      {/* ✅ REGISTER FORM */}
      {mode === "register" && (
        <div>
          <input style={auroraInput} placeholder="Имя" value={regName} onChange={(e) => setRegName(e.target.value)} />

          <input style={auroraInput} placeholder="Телефон" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />

          <input style={auroraInput} placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />

          <input style={auroraInput} placeholder="Instagram" value={regInstagram} onChange={(e) => setRegInstagram(e.target.value)} />

          <input
            style={auroraInput}
            type="password"
            placeholder="Пароль"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />

          <button style={auroraButton} onClick={doRegister}>Создать аккаунт</button>
        </div>
      )}

      {/* ✅ PASSWORD RECOVERY MODAL */}
      {recoveryOpen && (
        <div className="modal-backdrop" onClick={() => setRecoveryOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Восстановление</h3>

            <input
              style={auroraInput}
              placeholder="Ваш телефон"
              value={recoveryPhone}
              onChange={(e) => setRecoveryPhone(e.target.value)}
            />

            <button style={auroraButton} onClick={doRecovery}>Найти</button>

            {foundPass && (
              <p style={{ marginTop: 10, fontSize: 18 }}>
                Ваш пароль: <b>{foundPass}</b>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
