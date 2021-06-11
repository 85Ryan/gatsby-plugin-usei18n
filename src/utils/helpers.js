function isDefaultLang(locale, defaultLang) {
  return locale === defaultLang
}

function localizedPath({ defaultLang, prefixDefault, locale, path }) {
  if (isDefaultLang(locale, defaultLang) && !prefixDefault) {
    return path
  }

  const [, base] = path.split(`/`)

  if (base === locale) {
    return path
  }

  return `/${locale}${path}`
}

function getLanguages({ locales, localeStr }) {
  if (!localeStr) {
    return locales
  }
  const langCodes = localeStr.split(` `)
  const langs = []

  for (const code of langCodes) {
    const lang = locales.find(lang => lang.code === code)
    if (!code) {
      throw new Error(
        `Invalid localed provided: ${code}. See your i18n config file for a list of available locales.`
      )
    }
    langs.push(lang)
  }
  return langs
}

function getDefaultLanguage({ locales, defaultLang }) {
  return locales.find(locale => locale.code === defaultLang)
}

module.exports = {
  localizedPath,
  getLanguages,
  getDefaultLanguage
}
