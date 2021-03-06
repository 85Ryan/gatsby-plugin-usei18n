/* global GATSBY_PLUGIN_USEI18N */
import * as React from 'react'
import { IntlProvider } from 'react-intl'

const wrapPageElement = ({ element, props }) => {
  const locale = props.pageContext.locale
  const message = require(`${GATSBY_PLUGIN_USEI18N}/${locale}.json`)
  return (
    <IntlProvider locale={locale} key={locale} messages={message}>
      {element}
    </IntlProvider>
  )
}

export { wrapPageElement }
