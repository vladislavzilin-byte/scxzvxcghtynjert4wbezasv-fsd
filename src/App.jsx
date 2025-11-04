import Auth from './components/Auth.jsx'
import Calendar from './components/Calendar.jsx'
import Admin from './components/Admin.jsx'
import { useState } from 'react'
import { getCurrentUser } from './lib/storage'

export default function App(){
  const [tab, setTab] = useState('calendar')
  const [user, setUser] = useState(getCurrentUser())

  return (
    <div className="container">
      <div className="nav">
        <div className="brand"><img src="/logo.svg" alt="logo" /><span>IZ Booking</span></div>
        <div style={{display:'flex', gap:8}}>
          <button className={tab==='calendar'?'':'ghost'} onClick={()=>setTab('calendar')}>Календарь</button>
          <button className={tab==='admin'?'':'ghost'} onClick={()=>setTab('admin')}>Админ</button>
        </div>
      </div>

      <Auth onAuth={setUser} />
      {tab==='calendar' && <Calendar />}
      {tab==='admin' && <Admin />}

      <footer>
        <img src="/logo.svg" alt="logo" /> © IZ HAIR TREND
      </footer>
    </div>
  )
}
