
import { useState, useMemo } from 'react'
import { getSettings, saveSettings, getBookings, saveBookings, fmtDate, fmtTime, getCurrentUser } from '../lib/storage'
import { exportBookingsToCSV } from '../lib/export'

export default function Admin(){
  const [settings,setSettings] = useState(getSettings())
  const current = getCurrentUser()
  const isAdmin = current && (current.phone === settings.adminPhone || current.email === 'vladislavzilin@gmail.com')

  const [search,setSearch] = useState('')
  const [statusFilter,setStatusFilter] = useState('all')
  const [loading,setLoading] = useState(false)
  const [toast,setToast] = useState(null)
  const [bookings,setBookings] = useState(getBookings())

  const update = (patch) => { const next={...settings,...patch}; setSettings(next); saveSettings(next) }

  const stats = useMemo(()=>{
    const total = bookings.length
    const active = bookings.filter(b=>b.status==='active').length
    const canceled = bookings.filter(b=>b.status==='canceled_client' || b.status==='canceled_admin').length
    return { total, active, canceled }
  }, [bookings])

  const filtered = useMemo(()=>{
    const q = search.toLowerCase().trim()
    const arr = bookings.filter(b=>{
      const matchQ = !q || (b.userName?.toLowerCase().includes(q) || b.userPhone?.toLowerCase().includes(q) || b.userInstagram?.toLowerCase().includes(q))
      const matchStatus = statusFilter==='all' ? true : b.status===statusFilter
      return matchQ && matchStatus
    })
    arr.sort((a,b)=> new Date(a.start) - new Date(b.start))
    return arr
  }, [bookings, search, statusFilter])

  const refresh = () => {
    setLoading(true)
    setTimeout(()=>{
      setBookings(getBookings())
      setLoading(false)
    }, 400)
  }

  const cancelByAdmin = (id) => {
    if(!confirm('Отменить эту запись?')) return
    const next = getBookings().map(b=> b.id===id ? { ...b, status:'canceled_admin', canceledAt:new Date().toISOString() } : b)
    saveBookings(next)
    setBookings(next)
    refresh()
  }

  const handleExport = () => {
    const { name, count } = exportBookingsToCSV(filtered)
    setToast(`✅ Экспортировано ${count} записей в ${name}`)
    setTimeout(()=> setToast(null), 3500)
  }

  if(!isAdmin) return <div className="card"><b>Доступ только для администратора</b></div>

  const statusLabel = (b) => b.status==='active' ? '🟢 Активна' : (b.status==='canceled_client' ? '❌ Клиент' : '🔴 Админ')

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>Настройки мастера</h3>
          <div className="row">
            <div className="col"><label>Имя мастера</label><input value={settings.masterName} onChange={e=>update({masterName:e.target.value})}/></div>
            <div className="col"><label>Телефон администратора</label><input value={settings.adminPhone} onChange={e=>update({adminPhone:e.target.value})}/></div>
          </div>
          <div className="row">
            <div className="col"><label>Начало рабочего дня</label><input type="time" value={settings.workStart} onChange={e=>update({workStart:e.target.value})}/></div>
            <div className="col"><label>Конец рабочего дня</label><input type="time" value={settings.workEnd} onChange={e=>update({workEnd:e.target.value})}/></div>
            <div className="col"><label>Длительность слота (мин)</label><input type="number" min="15" step="15" value={settings.slotMinutes} onChange={e=>update({slotMinutes:parseInt(e.target.value||'60',10)})}/></div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{marginTop:0}}>Все записи</h3>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {loading ? <div className="spinner" title="Обновление..."></div> : <button onClick={refresh}>🔁 Обновить</button>}
              <button onClick={handleExport}>📤 Экспорт</button>
            </div>
          </div>

          <div style={{display:'flex',gap:8,margin:'8px 0 12px 0'}}>
            <input placeholder="Поиск по имени, телефону или Instagram" value={search} onChange={e=>setSearch(e.target.value)} />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="canceled_client">Отменено клиентом</option>
              <option value="canceled_admin">Отменено админом</option>
            </select>
          </div>

          <div className="badge">Всего: {stats.total} • Активных: {stats.active} • Отменённых: {stats.canceled}</div>

          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Instagram</th>
                <th>Дата</th>
                <th>Время</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ opacity: b.status==='active' ? 1 : .6 }}>
                  <td>{b.userName} <small className="muted">({b.userPhone})</small></td>
                  <td>{b.userInstagram || '-'}</td>
                  <td>{fmtDate(b.start)}</td>
                  <td>{fmtTime(b.start)}–{fmtTime(b.end)}</td>
                  <td>{statusLabel(b)}</td>
                  <td>{b.status==='active' && new Date(b.start)>new Date() ? <button className="danger" onClick={()=>cancelByAdmin(b.id)}>Отменить</button> : null}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="6"><small className="muted">Нет записей</small></td></tr>}
            </tbody>
          </table>

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  )
}
