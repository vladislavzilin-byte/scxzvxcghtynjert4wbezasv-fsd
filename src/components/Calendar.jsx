import { useMemo, useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, isSameMonth, isSameDay, format
} from 'date-fns'
import {
  getBookings, saveBookings, getSettings,
  getCurrentUser, id, isSameMinute
} from '../lib/storage'
import { useI18n } from '../lib/i18n'

function dayISO(d){ return new Date(d).toISOString().slice(0,10) }

// ✅ Fix: normalizing dates (removes time)
function toDateOnly(d){
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Calendar(){
  const { t } = useI18n()
  const settings = getSettings()

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [busy, setBusy] = useState(false)
  const [processingISO, setProcessingISO] = useState(null)
  const [bookedISO, setBookedISO] = useState([])
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
    const end   = new Date(d); end.setHours(eh, em, 0, 0)
    const slots = []
    let cur = new Date(start)
    while(cur <= end){
      slots.push(new Date(cur))
      cur = new Date(cur.getTime() + settings.slotMinutes*60000)
    }
    const blocked = settings.blockedDates.includes(dayISO(d))
    if(blocked) return []
    if(toDateOnly(d) < toDateOnly(minDate) || toDateOnly(d) > toDateOnly(maxDate)) return []
    return slots
  }

  const isTaken = (t) => {
    const storedTaken = bookings.some(b => (b.status==='approved' || b.status==='pending') && isSameMinute(b.start, t))
    const isProc = processingISO && isSameMinute(processingISO, t)
    const isLocal = bookedISO.some(x => isSameMinute(x, t))
    return storedTaken || isProc || isLocal
  }

  const book = (tSel) => {
    const user = getCurrentUser()
    if(!user) { alert(t('login_or_register')); return }
    if(isTaken(tSel)) { alert(t('already_booked')); return }

    setBusy(true)
    setProcessingISO(new Date(tSel))
    const end = new Date(tSel); end.setMinutes(end.getMinutes() + settings.slotMinutes)

    const newB = {
      id: id(),
      userPhone: user.phone,
      userName: user.name,
      userInstagram: user.instagram || '',
      start: tSel,
      end,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    saveBookings([ ...bookings, newB ])
    setBookedISO(prev => [...prev, new Date(tSel)])
    setBusy(false)
    setProcessingISO(null)
    setModal({
      title: t('booked_success'),
      dateStr: format(tSel,'dd.MM.yyyy'),
      timeStr: format(tSel,'HH:mm')+' – '+format(end,'HH:mm'),
      caption: t('wait_confirmation')+' '+t('details_in_my')
    })
  }

  const closeModal = () => setModal(null)

  // ───────────────────────────
  // Aurora-навигация календаря
  // ───────────────────────────

  const navBtnStyle = {
    width: 130,
    height: 46,
    borderRadius: 14,
    border: '1px solid rgba(168,85,247,0.40)',
    background: 'rgba(31, 0, 63, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fff',
    fontSize: 22,
    cursor: 'pointer',
    transition: '0.25s',
    boxShadow: '0 0 18px rgba(138,43,226,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none'
  }

  const centerPillStyle = {
    width: 130,
    height: 46,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    border: '1px solid rgba(168,85,247,0.40)',
    background: 'linear-gradient(145deg, rgba(66,0,145,0.55), rgba(20,0,40,0.60))',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
    boxShadow: '0 0 18px rgba(138,43,226,0.25)',
    letterSpacing: '0.5px'
  }

  const monthLabelRaw = format(currentMonth,'LLLL yyyy')
  const monthLabel = monthLabelRaw.charAt(0).toUpperCase()+monthLabelRaw.slice(1)

  return (
    <div className="card">

      {/* NAVIGATION */}
      <div style={{display:'flex',gap:16,alignItems:'center',justifyContent:'center',marginBottom:12}}>

        <button
          style={navBtnStyle}
          onClick={()=>setCurrentMonth(addMonths(currentMonth,-1))}
        >
          ←
        </button>

        <div style={centerPillStyle}>
          {monthLabel}
        </div>

        <button
          style={navBtnStyle}
          onClick={()=>setCurrentMonth(addMonths(currentMonth,1))}
        >
          →
        </button>
      </div>

      <div className="hr" />

      {/* GRID */}
      <div className="grid">
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((w,i)=>(
          <div key={i} className="muted" style={{textAlign:'center',fontWeight:600}}>{w}</div>
        ))}

        {days.map((d,idx)=>{
          const inMonth = isSameMonth(d,monthStart)
          const active  = isSameDay(d,selectedDate)

          // ✅ FIXED — now date selection works
          const disabled = toDateOnly(d) < toDateOnly(minDate) || toDateOnly(d) > toDateOnly(maxDate)

          return (
            <div
              key={idx}
              className={'datebtn '+(active?'active':'')}
              onClick={()=>!disabled&&setSelectedDate(d)}
              style={{
                opacity: inMonth?1:.4,
                cursor: disabled?'default':'pointer'
              }}
            >
              {format(d,'d')}
            </div>
          )
        })}
      </div>

      <div className="hr" />

      {/* SLOTS */}
      <div>
        <div className="badge">{t('slots_for')} {format(selectedDate,'dd.MM.yyyy')}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>
          {slotsForDay(selectedDate).map(ti=>{
            const taken = isTaken(ti)
            const isProcessing = processingISO && isSameMinute(processingISO, ti)
            const isLocal = bookedISO.some(x => isSameMinute(x, ti))
            let label = format(ti,'HH:mm')
            if(isProcessing) label = t('processing')
            else if(taken || isLocal) label = t('reserved_label')

            return (
              <button
                key={ti.toISOString()}
                disabled={taken||busy||isProcessing}
                className={(taken||isLocal)?'ghost':'ok'}
                onClick={()=>book(ti)}
              >
                {label}
              </button>
            )
          })}
          {slotsForDay(selectedDate).length===0 && (
            <small className="muted">Нет доступных слотов</small>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>{modal.title}</h3>
            {modal.dateStr && <p style={{margin:'6px 0'}}>{modal.dateStr}</p>}
            {modal.timeStr && <p style={{margin:'6px 0', fontWeight:700}}>{modal.timeStr}</p>}
            {modal.caption && <p style={{margin:'6px 0'}}>{modal.caption}</p>}
            <div style={{marginTop:12}}><button onClick={closeModal}>OK</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
