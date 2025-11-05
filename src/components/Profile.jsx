import React, { useState } from "react";
import { getCurrentUser, updateUser, saveCurrentUser } from "../utils/storage";

export default function Profile() {
  const user = getCurrentUser();
  if(!user){ return <div className="card"><h2>Мой профиль</h2><p className="muted">Войдите, чтобы редактировать профиль.</p></div> }

  const [name, setName] = useState(user.name||'');
  const [phone, setPhone] = useState(user.phone||'');
  const [inst, setInst] = useState(user.instagram || "");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [msg, setMsg] = useState("");

  const saveInfo = () => {
    const updated = { ...user, name, phone, instagram: inst };
    updateUser(updated);
    saveCurrentUser(updated);
    setMsg("Данные обновлены");
  };

  const savePassword = () => {
    if (oldPass !== (user.password||'')) {
      setMsg("Старый пароль неверный");
      return;
    }
    if (newPass.length < 4) {
      setMsg("Новый пароль слишком короткий");
      return;
    }

    const updated = { ...user, password: newPass };
    updateUser(updated);
    saveCurrentUser(updated);
    setMsg("Пароль изменён");
    setOldPass(""); setNewPass("");
  };

  return (
    <div className="card">
      <h2>Мой профиль</h2>

      <label>Имя</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Телефон</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label>Instagram</label>
      <input value={inst} onChange={(e) => setInst(e.target.value)} />

      <button onClick={saveInfo}>Сохранить</button>

      <h3>Смена пароля</h3>

      <input
        type="password"
        placeholder="Старый пароль"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="Новый пароль"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <button onClick={savePassword}>Изменить пароль</button>

      {msg && <p className="success">{msg}</p>}
    </div>
  );
}
