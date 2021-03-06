const path = require(`path`)

let didRunAlready = false
let absoluteLocaleDirectory

exports.onPreInit = ({ store }, { defaultLocale }) => {
  console.info('Loaded gatsby-plugin-usei18n')

  const localesPath = path.join(store.getState().program.directory, defaultLocale)

  if (!defaultLocale) {
    throw new Error(`
      Please define the 'defaultLocale' option of gatsby-plugin-usei18n.
    `)
  }

  if (didRunAlready) {
    throw new Error(
      `You can only have single instance of gatsby-plugin-usei18n in your gatsby-config.js`
    )
  }

  didRunAlready = true
  absoluteLocaleDirectory = path.dirname(localesPath)
}

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_PLUGIN_USEI18N: JSON.stringify(absoluteLocaleDirectory)
      })
    ]
  })
}
