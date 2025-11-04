import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Calendar from './components/Calendar'
import Admin from './components/Admin'
import MasterSettings from './components/MasterSettings'

export default function App() {
  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>IZ Booking v8.3</h1>
      <Calendar user={{ name: 'Test User', instagram: '@test' }} />
    </div>
  )
}
