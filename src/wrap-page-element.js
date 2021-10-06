/* global USEI18N_LOCALES_DIRECTORY */
import * as React from 'react'
import browserLang from 'browser-lang'
import { withPrefix } from 'gatsby'
import { IntlProvider } from 'react-intl'
import { LocaleProvider } from './context'
import { defaultLang, withDefaults } from './utils/default-options'
import { Seo } from './components/seo'

const wrapPageElement = ({ element, props }, i18nOptions) => {
  const { pageContext, location } = props
  const { routed, localeLangs, locale, redirect, originalPath } = pageContext
  const message = require(`${USEI18N_LOCALES_DIRECTORY}/${locale}.json`)
  const options = withDefaults(i18nOptions)
  const prefixDefault = options.prefixDefault

  if (typeof window !== 'undefined') {
    window.___gatsbyUseI18n = pageContext
  }
  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed
  if (isRedirect) {
    const { search } = location
    if (typeof window !== 'undefined') {
      let detected =
        window.localStorage.getItem(`lang`) ||
        browserLang({
          languages: localeLangs,
          fallback: defaultLang
        })
      if (!localeLangs.includes(detected)) {
        detected = locale
      }

      const queryParams = search || ''
      let urlPrefix
      if (!prefixDefault && detected === defaultLang) {
        urlPrefix = `${originalPath}${queryParams}`
      } else {
        urlPrefix = `/${detected}${originalPath}${queryParams}`
      }
      const newUrl = withPrefix(urlPrefix)
      window.localStorage.setItem(`lang`, detected)

      setTimeout(function () {
        const currentHref = window.location.href
        if (currentHref.indexOf(newUrl) == -1) {
          window.location.replace(newUrl)
        }
      }, 250)
      // window.location.href = newUrl
    }
  }

  return (
    <LocaleProvider pageContext={pageContext}>
      <Seo location={props.location} pageContext={pageContext} />
      <IntlProvider locale={locale} key={locale} messages={message}>
        {element}
      </IntlProvider>
    </LocaleProvider>
  )
}

export { wrapPageElement }
