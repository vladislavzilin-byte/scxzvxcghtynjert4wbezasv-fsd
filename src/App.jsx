
import Auth from './components/Auth.jsx'
import Calendar from './components/Calendar.jsx'
import Admin from './components/Admin.jsx'
import MyBookings from './components/MyBookings.jsx'
import { useEffect, useState } from 'react'
import { getCurrentUser } from './lib/storage'
import { t, getLang, setLang, dictionariesList } from './lib/i18n'

export default function App(){
  const [tab, setTab] = useState('calendar')
  const [user, setUser] = useState(getCurrentUser())
  const [lang, setLangState] = useState(getLang())

  useEffect(()=>{
    const onChange = (e)=> setLangState(e.detail.code)
    window.addEventListener('lang-change', onChange)
    return ()=> window.removeEventListener('lang-change', onChange)
  }, [])

  const changeLang = (e) => setLang(e.target.value)

  return (
    <div className="container">
      <div className="sticky">
        <div className="nav">
          <div className="brand"><img src="/logo.svg" alt="logo" /><span>IZ Booking</span></div>
          <div className="tabs">
            <button className={tab==='calendar'?'':'ghost'} onClick={()=>setTab('calendar')}>{t('calendar')}</button>
            <button className={tab==='my'?'':'ghost'} onClick={()=>setTab('my')}>{t('my')}</button>
            <button className={tab==='admin'?'':'ghost'} onClick={()=>setTab('admin')}>{t('admin')}</button>
            <div className="lang">
              <label className="muted">{t('lang')}</label>
              <select value={lang} onChange={changeLang}>
                {dictionariesList.map(l => <option value={l} key={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <Auth onAuth={setUser} />

      {tab==='calendar' && <Calendar />}
      {tab==='my' && <MyBookings />}
      {tab==='admin' && <Admin />}

      <footer>
        <img src="/logo.svg" alt="logo" /> © IZ HAIR TREND
      </footer>
    </div>
  )
}
