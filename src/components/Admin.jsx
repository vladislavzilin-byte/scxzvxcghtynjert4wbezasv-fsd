
import { useState, useMemo } from 'react'
import { getSettings, saveSettings, getBookings, saveBookings, fmtDate, fmtTime, getCurrentUser } from '../lib/storage'
import { exportBookingsToCSV } from '../lib/export'
import { sendEmail } from '../lib/email'
import AdminCalendar from './AdminCalendar.jsx'
import { useI18n } from '../lib/i18n'

export default function Admin(){
  const { t } = useI18n()
  const [settings,setSettings] = useState(getSettings())
  const current = getCurrentUser()
  const isAdmin = current && (current.phone === settings.adminPhone || current.email === 'vladislavzilin@gmail.com')

  const [search,setSearch] = useState('')
  const [statusFilter,setStatusFilter] = useState('all')
  const [loading,setLoading] = useState(false)
  const [toast,setToast] = useState(null)
  const [bookings,setBookings] = useState(getBookings())
  const [view,setView] = useState('list')

  const update = (patch) => { const next={...settings,...patch}; setSettings(next); saveSettings(next) }

  const stats = useMemo(()=>{
    const total = bookings.length
    const active = bookings.filter(b=>b.status==='approved' || b.status==='pending').length
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

  
// -------------------- ADMIN COMPONENT --------------------
export default function Admin() {
  const [bookings, setBookings] = useState(getBookings());
  const [view, setView] = useState('list');

  const approveByAdmin = (id) => {
    const now = new Date().toISOString();
    const list = getBookings();
    const target = list.find(b => b.id === id);
    const next = list.map(b => 
      b.id === id 
        ? { ...b, status: 'approved', approvedAt: now, notified: false } 
        : b
    );
    saveBookings(next);
    setBookings(next);
    if (target && target.userEmail) {
      sendEmail(
        target.userEmail,
        'Ваша запись подтверждена',
        `Здравствуйте, ${target.userName}! Ваша запись подтверждена.`
      );
    }
  };

  const cancelByAdmin = (id) => {
    if (!confirm('Отменить эту запись?')) return;
    const now = new Date().toISOString();
    const list = getBookings();
    const target = list.find(b => b.id === id);
    const next = list.map(b => 
      b.id === id 
        ? { ...b, status: 'canceled_admin', canceledAt: now, notified: false } 
        : b
    );
    saveBookings(next);
    setBookings(next);
    if (target && target.userEmail) {
      sendEmail(
        target.userEmail,
        'Запись отменена',
        `Здравствуйте, ${target.userName}. Запись была отменена администратором.`
      );
    }
  };

  if (view === 'calendar') {
    return (
      <div className="admin-calendar-view">
        <h2>📅 Календарь записей</h2>
        <AdminCalendar bookings={bookings} onApprove={approveByAdmin} onCancel={cancelByAdmin} />
        <button onClick={() => setView('list')}>Назад к списку</button>
      </div>
    );
  }

  return (
    <div className="admin-list-view">
      <h2>Все записи</h2>
      <BookingList
        bookings={bookings}
        onApprove={approveByAdmin}
        onCancel={cancelByAdmin}
        onCalendar={() => setView('calendar')}
      />
    </div>
  );
}
