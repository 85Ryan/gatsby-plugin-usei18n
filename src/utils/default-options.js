const defaultLang = `en`

function withDefaults(i18nOptions) {
  return {
    ...i18nOptions,
    configPath: i18nOptions.configPath,
    defaultLang: i18nOptions.defaultLang || defaultLang,
    prefixDefault: i18nOptions.prefixDefault ? i18nOptions.prefixDefault : false,
    locales: i18nOptions.locales || null,
    redirect: i18nOptions.redirect || false
  }
}

module.exports = {
  defaultLang,
  withDefaults
}
