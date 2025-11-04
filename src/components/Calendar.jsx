import React, { useState } from 'react'
import { getBookings, saveBookings } from '../lib/storage'
import { toast } from 'react-toastify'

export default function Calendar({ user }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookings, setBookings] = useState(getBookings())

  const handleSelectSlot = (day, time) => {
    setSelectedDate(day)
    setSelectedTime(time)
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Выберите дату и время!')
      return
    }
    const list = getBookings()
    const newBooking = {
      id: crypto.randomUUID(),
      userName: user?.name || 'Неизвестно',
      instagram: user?.instagram || '',
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      notified: false
    }
    const next = [...list, newBooking]
    saveBookings(next)
    setBookings(next)
    toast.success('Запись отправлена! Ждите подтверждения.')
  }

  return (
    <div className="calendar-component">
      <h3>Выберите дату и время</h3>
      <div className="slots">
        {/* Пример слотов */}
        {[...Array(5)].map((_, i) => {
          const day = `2025-11-0${i + 5}`
          return (
            <div key={day} className="day">
              <h4>{day}</h4>
              {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((t) => (
                <button
                  key={t}
                  className={selectedDate === day && selectedTime === `${t}:00` ? 'selected' : ''}
                  onClick={() => handleSelectSlot(day, `${t}:00`)}
                >
                  {t}:00
                </button>
              ))}
            </div>
          )
        })}
      </div>

      <div className="confirm">
        <p>Вы выбрали: {selectedDate ? `${selectedDate} в ${selectedTime}` : 'ничего'}</p>
        <button onClick={handleBooking}>Подтвердить запись</button>
      </div>
    </div>
  )
}
