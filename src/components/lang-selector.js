import React from 'react'
import { LocalizedLink } from './localized-link'
import { useLocalization } from '../hooks/use-localization'

const LangSelector = ({ path, toggleLanguage }) => {
  const { config } = useLocalization()
  return (
    <>
      <ul>
        {config.map(local => (
          <li key={local.code}>
            <LocalizedLink
              to={path}
              language={local.code}
              onClick={() => toggleLanguage(local.code)}
            >
              {local.localName}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </>
  )
}

export { LangSelector }
