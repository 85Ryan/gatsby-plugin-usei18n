import React from 'react'
import { LocalizedLink } from './localized-link'
import { useLocalization } from '../hooks/use-localization'

const LangSelector = ({ className, path, toggleLanguage }) => {
  const { config } = useLocalization()
  return (
    <div className={`${className}`}>
      <ul className={`${className}_list`}>
        {config.map(local => (
          <li key={local.code} className={`${className}_list_item`}>
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
    </div>
  )
}

export { LangSelector }
