import React, { createContext, useContext, useState, useEffect } from 'react'
import { getLang, setLang as saveLang } from '../utils/storage'

const I18nContext = createContext()

export function I18nProvider({ children }){
  const [lang, setLang] = useState(getLang() || 'ru')
  useEffect(()=>{ saveLang(lang) },[lang])
  const t = (k) => dict[lang]?.[k] || k
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}
export function useI18n(){ return useContext(I18nContext) }

const dict = {
  ru:{ login:'Вход', register:'Регистрация' },
  en:{ login:'Login', register:'Register' }
}
