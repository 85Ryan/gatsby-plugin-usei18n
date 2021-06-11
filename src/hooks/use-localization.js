import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { LocaleContext } from '../context'
import { localizedPath } from '../utils/helpers'

function useLocalization() {
  const locale = React.useContext(LocaleContext).lang
  const {
    siteI18N: { defaultLang, prefixDefault, config }
  } = useStaticQuery(graphql`
    query LocalizationConfigQuery {
      siteI18N {
        defaultLang
        prefixDefault
        config {
          code
          hrefLang
          dateFormat
          langDir
          localName
          name
        }
      }
    }
  `)
  return {
    locale,
    defaultLang,
    prefixDefault,
    config,
    localizedPath
  }
}

export { useLocalization }
