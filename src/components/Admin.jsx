import React from 'react'
import { getBookings, saveBookings, getCurrentUser } from '../lib/storage'

const ADMINS=['irina.abramova7@gmail.com','vladislavzilin@gmail.com']

export default function Admin(){
  const me = getCurrentUser()
  const isAdmin = me && (me.role==='admin' || (me.email && ADMINS.includes(me.email)))
  if(!isAdmin) return <div className="card"><h3>Доступ запрещён</h3><p className="muted">Эта страница доступна только администраторам.</p></div>

  const [bookings,setBookings] = React.useState(getBookings())
  const approve = (id)=>{ const next=bookings.map(b=>b.id===id?{...b,status:'approved'}:b); saveBookings(next); setBookings(next) }
  const cancel = (id)=>{ const next=bookings.map(b=>b.id===id?{...b,status:'canceled_admin'}:b); saveBookings(next); setBookings(next) }

  const [view,setView] = React.useState('list')
  const [log,setLog] = React.useState([])
  React.useEffect(()=>{ if(view==='resetlog'){ fetch('http://localhost:4000/api/reset-log').then(r=>r.json()).then(setLog) } },[view])

  if(view==='resetlog'){
    return <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Сбросы паролей</h3>
        <button className="ghost" onClick={()=>setView('list')}>← Назад</button>
      </div>
      <table className="table"><thead><tr><th>Время</th><th>E-mail</th><th>Статус</th><th>Ошибка</th></tr></thead>
      <tbody>
        {log.map((x,i)=>(<tr key={i}><td>{new Date(x.at).toLocaleString('lt-LT')}</td><td>{x.email}</td><td>{x.status}</td><td>{x.error||'—'}</td></tr>))}
        {log.length===0 && <tr><td colSpan="4"><small className="muted">Пока нет записей</small></td></tr>}
      </tbody></table>
    </div>
  }

  return <div className="card">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h3>Все записи</h3>
      <div style={{display:'flex', gap:8}}>
        <button className="ghost" onClick={()=>setView('resetlog')}>🛡️ Сбросы паролей</button>
      </div>
    </div>
    <table className="table">
      <thead><tr><th>Дата</th><th>Время</th><th>Клиент</th><th>Instagram</th><th>Статус</th><th>Действие</th></tr></thead>
      <tbody>
        {bookings.map(b=>(
          <tr key={b.id}>
            <td>{ b.date ? new Date(b.date).toLocaleDateString('lt-LT') : (b.start? new Date(b.start).toLocaleDateString('lt-LT') : '—') }</td>
            <td>{ b.time || (b.start? new Date(b.start).toLocaleTimeString('lt-LT',{hour:'2-digit',minute:'2-digit'}) : '—') }</td>
            <td>{b.userName}</td><td>{b.instagram}</td>
            <td>{b.status==='pending'?'🟡 Ожидает':b.status==='approved'?'🟢 Подтверждена':'🔴 Отменена'}</td>
            <td>{b.status==='pending'? <><button onClick={()=>approve(b.id)}>✅ Подтвердить</button> <button onClick={()=>cancel(b.id)}>❌ Отменить</button></> : <button onClick={()=>cancel(b.id)}>❌ Отменить</button>}</td>
          </tr>
        ))}
        {bookings.length===0 && <tr><td colSpan="6"><small className="muted">Пока нет записей</small></td></tr>}
      </tbody>
    </table>
  </div>
}
