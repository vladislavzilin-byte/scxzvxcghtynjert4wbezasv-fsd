
import { useMemo, useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay, format } from 'date-fns'
import { getBookings, saveBookings, getSettings, getCurrentUser, id, isSameMinute } from '../lib/storage'
import { t } from '../lib/i18n'

function dayISO(d){ return new Date(d).toISOString().slice(0,10) }

export default function Calendar(){
  const settings = getSettings()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [busy, setBusy] = useState(false)
  const [modal, setModal] = useState(null)

  const minDate = new Date()
  const maxDate = addMonths(new Date(), 24)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(()=>{
    const arr=[]; let d=gridStart; while(d<=gridEnd){ arr.push(d); d=addDays(d,1) } return arr
  }, [currentMonth])

  const bookings = getBookings()

  const slotsForDay = (d) => {
    const [sh, sm] = settings.workStart.split(':').map(Number)
    const [eh, em] = settings.workEnd.split(':').map(Number)
    const start = new Date(d); start.setHours(sh, sm, 0, 0)
    const end = new Date(d); end.setHours(eh, em, 0, 0)
    const slots = []
    let cur = new Date(start)
    while(cur <= end){ slots.push(new Date(cur)); cur = new Date(cur.getTime() + settings.slotMinutes*60000) }
    const blocked = settings.blockedDates.includes(dayISO(d))
    if(blocked) return []
    if(d < new Date(minDate.toDateString()) || d > maxDate) return []
    return slots
  }

  const isTaken = (t) => bookings.some(b => (b.status==='active' || b.status==='pending') && isSameMinute(b.start, t))

  const book = (t) => {
    const user = getCurrentUser()
    if(!user) return alert(t('requiresLogin'))
    if(isTaken(t)) return alert(t('slotTaken'))
    setBusy(true)
    const end = new Date(t); end.setMinutes(end.getMinutes() + settings.slotMinutes)
    const newB = {
      id:id(), userPhone:user.phone, userName:user.name, userInstagram:user.instagram||'',
      start:t, end, status:'pending', createdAt:new Date().toISOString()
    }
    saveBookings([ ...bookings, newB ])
    setBusy(false)
    setModal({
      title: t('confirmTitle')(settings.masterName),
      subtitle: t('confirmSubtitle'),
      dateStr: format(t,'dd.MM.yyyy'),
      timeStr: format(t,'HH:mm')+' – '+format(end,'HH:mm')
    })
  }

  const closeModal = () => setModal(null)

  return (
    <div className="card">
      <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'space-between'}}>
        <button className="ghost" onClick={()=>setCurrentMonth(addMonths(currentMonth,-1))}>←</button>
        <div className="badge">{format(currentMonth,'LLLL yyyy')}</div>
        <button className="ghost" onClick={()=>setCurrentMonth(addMonths(currentMonth,1))}>→</button>
      </div>

      <div className="hr" />

      <div className="grid">
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((w,i)=>(<div key={i} className="muted" style={{textAlign:'center',fontWeight:600}}>{w}</div>))}
        {days.map((d,idx)=>{
          const inMonth=isSameMonth(d,monthStart), active=isSameDay(d,selectedDate)
          const disabled=d<new Date(minDate.toDateString())||d>maxDate
          return (
            <div key={idx} className={'datebtn '+(active?'active':'')} onClick={()=>!disabled&&setSelectedDate(d)}
              style={{opacity:inMonth?1:.4,pointerEvents:disabled?'none':'auto'}}>{format(d,'d')}</div>
          )
        })}
      </div>

      <div className="hr" />

      <div>
        <div className="badge">{t('slotsFor')} {format(selectedDate,'dd.MM.yyyy')}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>
          {slotsForDay(selectedDate).map(ti=>{
            const taken=isTaken(ti)
            return <button key={ti.toISOString()} disabled={taken||busy} className={taken?'ghost':'ok'} onClick={()=>book(ti)}>{format(ti,'HH:mm')}{taken?` ${t('booked')}`:''}</button>
          })}
          {!slotsForDay(selectedDate).length && <small className="muted">—</small>}
        </div>
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p className="muted" style={{marginTop:4}}>{modal.subtitle}</p>
            <p style={{margin:'6px 0'}}>{modal.dateStr}</p>
            <p style={{margin:'6px 0', fontWeight:700}}>{modal.timeStr}</p>
            <div style={{marginTop:12}}><button onClick={closeModal}>{t('ok')}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
