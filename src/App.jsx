import React from 'react'
import Login from './components/Login'
import Profile from './components/Profile'
import Admin from './components/Admin'
import { getCurrentUser } from './lib/storage'

export default function App(){
  const [_,force] = React.useState(0)
  const me = getCurrentUser()

  React.useEffect(()=>{
    const int = setInterval(()=>force(x=>x+1), 2000)
    return ()=>clearInterval(int)
  },[])

  return (
    <div style={{maxWidth:980, margin:'40px auto', padding:'0 16px', fontFamily:'Inter, system-ui, Arial'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h1 style={{margin:0}}>IZ Booking v8.1.0</h1>
        <div style={{display:'flex', gap:12}}>
          <a href="#profile" className="ghost">Мой профиль</a>
          <a href="#admin" className="ghost">Админ</a>
        </div>
      </div>

      <div className="grid" style={{display:'grid', gridTemplateColumns:'1fr', gap:16, marginTop:16}}>
        {!me && <Login />}
        <div id="profile"><Profile /></div>
        <div id="admin"><Admin /></div>
      </div>

      <style>{`
        .card{ background:#12131a;border:1px solid #23242c;border-radius:14px;padding:16px }
        .ghost{ background:transparent;border:1px solid #2b2d33;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer }
        input, button{ padding:10px 12px;border-radius:10px;border:1px solid #2b2d33;background:#191a1f;color:#fff }
        label{ display:block;margin-top:10px;margin-bottom:6px;opacity:.85 }
        table.table{ width:100%; border-collapse:collapse; margin-top:10px }
        .table th, .table td{ border-bottom:1px solid #2b2d33; padding:8px; text-align:left }
        .modal-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; z-index:1000 }
        .modal{ background:#12131a;border:1px solid #23242c;border-radius:14px;padding:16px; width:360px }
        .muted{ opacity:.7 }
        .hr{ height:1px; background:#2b2d33; margin:12px 0 }
        .row{ display:grid; grid-template-columns: 1fr 1fr; gap:10px }
        .col{ display:flex; flex-direction:column }
      `}</style>
    </div>
  )
}
