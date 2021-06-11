import * as React from 'react'
import { Link } from 'gatsby'
import { localizedPath } from '../utils/helpers'
import { useLocalization } from '../hooks/use-localization'

const LocalizedLink = ({ to, language, ...props }) => {
  const { defaultLang, prefixDefault, locale } = useLocalization()
  const linkLocale = language || locale
  return (
    <Link
      {...props}
      to={localizedPath({ defaultLang, prefixDefault, locale: linkLocale, path: to })}
    />
  )
}

export { LocalizedLink }
