import React from 'react'
import Auth from './components/Auth.jsx'
import './styles.css'

export default function App(){
  return (
    <div className="container">
      <div className="grid">
        <Auth />
        <div className="card">
          <div className="muted">Здесь может быть календарь / записи и т.д.</div>
        </div>
      </div>
    </div>
  )
}
