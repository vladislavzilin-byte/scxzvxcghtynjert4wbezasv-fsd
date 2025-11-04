
import { useState, useMemo } from 'react'
import { getSettings, saveSettings, getBookings, saveBookings, fmtDate, fmtTime, getCurrentUser } from '../lib/storage'
import { exportBookingsToCSV } from '../lib/export'
import { t } from '../lib/i18n'

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
    const pending = bookings.filter(b=>b.status==='pending').length
    const canceled = bookings.filter(b=>b.status==='canceled_client' || b.status==='canceled_admin').length
    return { total, active, pending, canceled }
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
    }, 350)
  }

  const confirmBooking = (id) => {
    const next = getBookings().map(b=> b.id===id ? { ...b, status:'active' } : b)
    saveBookings(next); setBookings(next)
  }
  const cancelByAdmin = (id) => {
    if(!confirm('Отменить эту запись?')) return
    const next = getBookings().map(b=> b.id===id ? { ...b, status:'canceled_admin', canceledAt:new Date().toISOString() } : b)
    saveBookings(next); setBookings(next); refresh()
  }

  const handleExport = () => {
    const { name, count } = exportBookingsToCSV(filtered)
    setToast(`✅ Экспортировано ${count} записей в ${name}`)
    setTimeout(()=> setToast(null), 3500)
  }

  if(!isAdmin) return <div className="card"><b>{t('adminOnly')}</b></div>

  const statusLabel = (b) => b.status==='active' ? t('activeStatus') : (b.status==='pending' ? t('pending') : (b.status==='canceled_client' ? t('canceledByClient') : t('canceledByAdmin')))

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>{t('masterSettings')}</h3>
          <div className="row">
            <div className="col"><label>{t('masterName')}</label><input value={settings.masterName} onChange={e=>update({masterName:e.target.value})}/></div>
            <div className="col"><label>{t('adminPhone')}</label><input value={settings.adminPhone} onChange={e=>update({adminPhone:e.target.value})}/></div>
          </div>
          <div className="row">
            <div className="col"><label>{t('workStart')}</label><input type="time" value={settings.workStart} onChange={e=>update({workStart:e.target.value})}/></div>
            <div className="col"><label>{t('workEnd')}</label><input type="time" value={settings.workEnd} onChange={e=>update({workEnd:e.target.value})}/></div>
            <div className="col"><label>{t('slotMinutes')}</label><input type="number" min="15" step="15" value={settings.slotMinutes} onChange={e=>update({slotMinutes:parseInt(e.target.value||'60',10)})}/></div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{marginTop:0}}>{t('allBookings')}</h3>
            <div className="inline-tools">
              {loading ? <div className="spinner" title="..."></div> : <button onClick={refresh}>{t('refresh')}</button>}
              <button onClick={handleExport}>{t('export')}</button>
            </div>
          </div>

          <div style={{display:'flex',gap:8,margin:'8px 0 12px 0'}}>
            <input placeholder={t('searchPH')} value={search} onChange={e=>setSearch(e.target.value)} />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">{t('all')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="active">{t('active')}</option>
              <option value="canceled_client">{t('canceledByClient')}</option>
              <option value="canceled_admin">{t('canceledByAdmin')}</option>
            </select>
          </div>

          <div className="badge">{t('stats')(stats.total, stats.active, stats.canceled)} • {t('pending')}: {stats.pending}</div>

          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>{t('client')}</th>
                <th>Instagram</th>
                <th>{t('date')}</th>
                <th>{t('time')}</th>
                <th>{t('status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ opacity: b.status==='active' ? 1 : .9 }}>
                  <td>{b.userName} <small className="muted">({b.userPhone})</small></td>
                  <td>{b.userInstagram || '-'}</td>
                  <td>{fmtDate(b.start)}</td>
                  <td>{fmtTime(b.start)}–{fmtTime(b.end)}</td>
                  <td>{statusLabel(b)}</td>
                  <td style={{display:'flex',gap:8}}>
                    {b.status==='pending' && <button className="ok" onClick={()=>confirmBooking(b.id)}>{t('confirmByAdmin')}</button>}
                    {b.status!=='canceled_admin' && b.status!=='canceled_client' && new Date(b.start)>new Date() && (
                      <button className="danger" onClick={()=>cancelByAdmin(b.id)}>{t('cancel')}</button>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="6"><small className="muted">—</small></td></tr>}
            </tbody>
          </table>

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  )
}
