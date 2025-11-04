import React, { useState } from 'react'
import { getBookings, saveBookings } from '../lib/storage'
import { sendEmail } from '../lib/email'
import BookingList from './BookingList'
import Calendar from './Calendar'

export default function Admin() {
  const [bookings, setBookings] = useState(getBookings())
  const [view, setView] = useState('list')

  const approveByAdmin = (id) => {
    const now = new Date().toISOString()
    const list = getBookings()
    const target = list.find(b => b.id === id)
    const next = list.map(b => 
      b.id === id 
        ? { ...b, status: 'approved', approvedAt: now, notified: false } 
        : b
    )
    saveBookings(next)
    setBookings(next)
    if (target && target.userEmail) {
      sendEmail(
        target.userEmail,
        'Ваша запись подтверждена',
        `Здравствуйте, ${target.userName}! Ваша запись подтверждена.`
      )
    }
  }

  const cancelByAdmin = (id) => {
    if (!confirm('Отменить эту запись?')) return
    const now = new Date().toISOString()
    const list = getBookings()
    const target = list.find(b => b.id === id)
    const next = list.map(b => 
      b.id === id 
        ? { ...b, status: 'canceled_admin', canceledAt: now, notified: false } 
        : b
    )
    saveBookings(next)
    setBookings(next)
    if (target && target.userEmail) {
      sendEmail(
        target.userEmail,
        'Запись отменена',
        `Здравствуйте, ${target.userName}. Запись была отменена администратором.`
      )
    }
  }

  if (view === 'calendar') {
    return (
      <div className="admin-calendar-view">
        <h2>📅 Календарь записей</h2>
        <Calendar bookings={bookings} onApprove={approveByAdmin} onCancel={cancelByAdmin} />
        <button onClick={() => setView('list')}>Назад к списку</button>
      </div>
    )
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
  )
}
