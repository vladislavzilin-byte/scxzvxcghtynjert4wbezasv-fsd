
import { useMemo, useState } from 'react'
import { getCurrentUser, getBookings, saveBookings, fmtDate, fmtTime } from '../lib/storage'

export default function MyBookings(){
  const user = getCurrentUser()
  const [filter,setFilter] = useState('all') // all | active | canceled
  const [confirmId, setConfirmId] = useState(null)

  const all = getBookings().filter(b=> user && b.userPhone===user.phone)
  const active = all.filter(b=> b.status==='active' && new Date(b.end) >= new Date())
  const canceled = all.filter(b=> b.status==='canceled_client' || b.status==='canceled_admin')
  const past = all.filter(b=> b.status==='active' && new Date(b.end) < new Date())

  const list = useMemo(()=>{
    if(filter==='active') return active
    if(filter==='canceled') return canceled
    return all
  }, [filter, all.length])

  const cancel = (id) => setConfirmId(id)
  const doCancel = () => {
    const id = confirmId
    const arr = getBookings().map(b=> b.id===id ? { ...b, status:'canceled_client', canceledAt:new Date().toISOString() } : b)
    saveBookings(arr)
    setConfirmId(null)
  }

  if(!user){
    return <div className="card"><b>Войдите</b> чтобы видеть личный кабинет и управлять своими записями.</div>
  }

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 style={{marginTop:0}}>Мой профиль</h3>
          <div><b>{user.name}</b></div>
          <div><small className="muted">{user.phone}{user.email ? ' • '+user.email : ''}{user.instagram ? ' • '+user.instagram : ''}</small></div>
          <div className="hr" />
          <div className="badge">У вас {active.length} активных запись(и)</div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{marginTop:0}}>Мои записи</h3>
            <div style={{display:'flex',gap:8}}>
              <button className={filter==='all'?'':'ghost'} onClick={()=>setFilter('all')}>Все</button>
              <button className={filter==='active'?'':'ghost'} onClick={()=>setFilter('active')}>Активные</button>
              <button className={filter==='canceled'?'':'ghost'} onClick={()=>setFilter('canceled')}>Отменённые</button>
            </div>
          </div>
          <table className="table">
            <thead><tr><th>Дата</th><th>Время</th><th>Статус</th><th></th></tr></thead>
            <tbody>
              {list.map(b=>{
                const status = b.status==='active' ? (new Date(b.end) < new Date() ? '⚫ Прошла' : '🟢 Активна') :
                               b.status==='canceled_client' ? '❌ Отменено клиентом' : '🔴 Отменено администратором'
                const canCancel = b.status==='active' && new Date(b.start) > new Date()
                return (
                  <tr key={b.id} style={{opacity: b.status==='active' ? 1 : .6}}>
                    <td>{fmtDate(b.start)}</td>
                    <td>{fmtTime(b.start)}–{fmtTime(b.end)}</td>
                    <td>{status}</td>
                    <td style={{width:140}}>{canCancel ? <button className="danger" onClick={()=>cancel(b.id)}>Отменить</button> : null}</td>
                  </tr>
                )
              })}
              {!list.length && <tr><td colSpan="4"><small className="muted">Нет записей</small></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {confirmId && (
        <div className="modal-backdrop" onClick={()=>setConfirmId(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Отменить запись?</h3>
            <p><small className="muted">Это действие нельзя отменить.</small></p>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="danger" onClick={doCancel}>Да, отменить</button>
              <button className="ghost" onClick={()=>setConfirmId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
