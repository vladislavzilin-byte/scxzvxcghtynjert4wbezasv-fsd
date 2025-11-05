import React, { useState } from "react";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { getCurrentUser, saveCurrentUser } from "./utils/storage";

export default function App() {
  const [user, setUser] = useState(getCurrentUser());

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
  };

  if (!user) {
    return <div style={{maxWidth:920,margin:'40px auto',padding:'0 16px'}}><Login onLogin={setUser} /></div>;
  }

  return (
    <div style={{maxWidth:920,margin:'40px auto',padding:'0 16px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h1 style={{margin:0}}>IZ Booking</h1>
        <button className="ghost" onClick={handleLogout}>Выйти</button>
      </header>
      <Profile />
      <style>{`
        body{ background:#0f1014; color:#fff; font-family: Inter, system-ui, Arial }
        .card{ background:#12131a; border:1px solid #23242c; border-radius:14px; padding:16px }
        input, button{ padding:10px 12px; border-radius:10px; border:1px solid #2b2d33; background:#191a1f; color:#fff }
        label{ display:block; margin-top:10px; margin-bottom:6px; opacity:.85 }
        .ghost{ background:transparent; border:1px solid #2b2d33; color:#fff; border-radius:10px; padding:8px 12px; cursor:pointer }
        .error{ color:#ff7a7a; margin-top:8px }
        .success{ color:#a2ffb2; margin-top:8px }
        .muted{ opacity:.7 }
      `}</style>
    </div>
  );
}
