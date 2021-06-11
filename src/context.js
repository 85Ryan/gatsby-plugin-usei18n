import * as React from 'react'
import { defaultLang } from '../src/utils/default-options'

const LocaleContext = React.createContext(defaultLang)

const LocaleProvider = ({ children, pageContext: { locale = defaultLang } }) => {
  const [loading, setLoading] = React.useState(true)
  const [lang, setLanguage] = React.useState(locale)

  const handleLanguage = value => {
    setLanguage(value)
    localStorage.setItem(`lang`, value)
  }

  React.useEffect(() => {
    const localeLang = localStorage.getItem(`lang`)
    localeLang ? setLanguage(localeLang) : setLanguage(navigator.language)
    setLoading(false)
  }, [])
  return (
    <LocaleContext.Provider value={{ lang, handleLanguage }}>
      {!loading && children}
    </LocaleContext.Provider>
  )
}

export { LocaleContext, LocaleProvider }
