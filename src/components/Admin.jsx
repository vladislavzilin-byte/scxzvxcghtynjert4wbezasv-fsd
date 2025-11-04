import { useState } from 'react'
import { getSettings, saveSettings, getBookings, saveBookings, fmtDate, fmtTime, getCurrentUser } from '../lib/storage'

export default function Admin(){
  const [settings,setSettings] = useState(getSettings())
  const current = getCurrentUser()
  const isAdmin = current && (current.phone === settings.adminPhone || current.email === 'vladislavzilin@gmail.com')

  const update = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next); saveSettings(next)
  }

  const bookings = getBookings().sort((a,b)=> new Date(a.start) - new Date(b.start))

  const cancel = (id) => {
    if(!confirm('Удалить запись?')) return
    saveBookings(bookings.filter(b=>b.id!==id))
    alert('Удалено')
  }

  if(!isAdmin){
    return <div className="card"><b>Доступ только для администратора</b></div>
  }

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>Настройки мастера</h3>
          <div className="row">
            <div className="col">
              <label>Имя мастера</label>
              <input value={settings.masterName} onChange={e=>update({masterName:e.target.value})} />
            </div>
            <div className="col">
              <label>Телефон администратора</label>
              <input value={settings.adminPhone} onChange={e=>update({adminPhone:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>Начало рабочего дня</label>
              <input type="time" value={settings.workStart} onChange={e=>update({workStart:e.target.value})} />
            </div>
            <div className="col">
              <label>Конец рабочего дня</label>
              <input type="time" value={settings.workEnd} onChange={e=>update({workEnd:e.target.value})} />
            </div>
            <div className="col">
              <label>Длительность слота (мин)</label>
              <input type="number" min="15" step="15" value={settings.slotMinutes} onChange={e=>update({slotMinutes:parseInt(e.target.value||'60', 10)})} />
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>Все записи</h3>
          <table className="table">
            <thead><tr><th>Клиент</th><th>Instagram</th><th>Дата</th><th>Время</th><th></th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.userName} <small className="muted">({b.userPhone})</small></td>
                  <td>{b.userInstagram || '-'}</td>
                  <td>{fmtDate(b.start)}</td>
                  <td>{fmtTime(b.start)}–{fmtTime(b.end)}</td>
                  <td><button className="danger" onClick={()=>cancel(b.id)}>Удалить</button></td>
                </tr>
              ))}
              {!bookings.length && <tr><td colSpan="5"><small className="muted">Пока пусто</small></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
