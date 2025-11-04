
import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getBookings, saveBookings, fmtDate, fmtTime } from '../lib/storage'
import { t } from '../lib/i18n'

export default function MyBookings(){
  const user = getCurrentUser()
  const [filter,setFilter] = useState('all')
  const [confirmId, setConfirmId] = useState(null)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const load = () => {
    const all = getBookings().filter(b=> user && b.userPhone===user.phone).sort((a,b)=> new Date(a.start) - new Date(b.start))
    setList(all)
  }

  useEffect(()=>{ load() }, [])

  const filtered = useMemo(()=>{
    if(filter==='active') return list.filter(b=> b.status==='active')
    if(filter==='canceled') return list.filter(b=> b.status==='canceled_client' || b.status==='canceled_admin')
    return list
  }, [filter, list])

  const activeCount = list.filter(b=> b.status==='active' && new Date(b.end)>=new Date()).length

  const cancel = (id) => setConfirmId(id)
  const doCancel = () => {
    const id = confirmId
    const arr = getBookings().map(b=> b.id===id ? { ...b, status:'canceled_client', canceledAt:new Date().toISOString() } : b)
    saveBookings(arr)
    setConfirmId(null)
    load()
  }

  const refresh = () => {
    setLoading(true)
    setTimeout(()=>{ load(); setLoading(false) }, 350)
  }

  if(!user){
    return <div className="card"><b>{t('requiresLogin')}</b></div>
  }

  const statusLabel = (b) => b.status==='active'
    ? (new Date(b.end) < new Date() ? t('passed') : t('activeStatus'))
    : (b.status==='pending' ? t('pending') : (b.status==='canceled_client' ? t('canceledByClient') : t('canceledByAdmin')))

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>{t('myProfile')}</h3>
          <div><b>{user.name}</b></div>
          <div><small className="muted">{user.phone}{user.email ? ' • '+user.email : ''}{user.instagram ? ' • '+user.instagram : ''}</small></div>
          <div className="hr" />
          <div className="badge">{t('profileCounter')(activeCount)}</div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{marginTop:0}}>{t('myBookings')}</h3>
            <div className="inline-tools">
              <button className={filter==='all'?'':'ghost'} onClick={()=>setFilter('all')}>{t('all')}</button>
              <button className={filter==='active'?'':'ghost'} onClick={()=>setFilter('active')}>{t('active')}</button>
              <button className={filter==='canceled'?'':'ghost'} onClick={()=>setFilter('canceled')}>{t('canceled')}</button>
              {loading ? <div className="spinner" title="..."></div> : <button onClick={refresh}>{t('refreshList')}</button>}
            </div>
          </div>
          <table className="table">
            <thead><tr><th>{t('date')}</th><th>{t('time')}</th><th>{t('status')}</th><th></th></tr></thead>
            <tbody>
              {filtered.map(b=>{
                const canCancel = (b.status==='pending' || b.status==='active') && new Date(b.start)>new Date()
                return (
                  <tr key={b.id} style={{opacity: b.status==='active' ? 1 : .8}}>
                    <td>{fmtDate(b.start)}</td>
                    <td>{fmtTime(b.start)}–{fmtTime(b.end)}</td>
                    <td>{statusLabel(b)}</td>
                    <td style={{width:160}}>{canCancel ? <button className="danger" onClick={()=>cancel(b.id)}>{t('cancel')}</button> : null}</td>
                  </tr>
                )
              })}
              {!filtered.length and False or ( !filtered.length and None ) }
              {!filtered.length && <tr><td colSpan="4"><small className="muted">{t('none')}</small></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {confirmId && (
        <div className="modal-backdrop" onClick={()=>setConfirmId(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>{t('cancelQ')}</h3>
            <p><small className="muted">{t('cancelNote')}</small></p>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="danger" onClick={doCancel}>{t('yesCancel')}</button>
              <button className="ghost" onClick={()=>setConfirmId(null)}>{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
