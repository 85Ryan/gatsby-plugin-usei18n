const path = require(`path`)
const { withDefaults } = require(`./src/utils/default-options`)
const { localizedPath, getLanguages, getDefaultLanguage } = require(`./src/utils/helpers`)

let localesDirectory

try {
  require.resolve('react-intl')
} catch (err) {
  throw new Error(`
  'react-intl' is not installed. You must install this to use 'gatsby-plugin-usei18n'`)
}

exports.onPreInit = ({ reporter }, i18nOptions) => {
  reporter.info(`Loaded gatsby-plugin-usei18n`)

  if (!i18nOptions.configPath) {
    throw new Error(`
      [gatsby-plugin-usei18n]: Please define the 'configPath' option.
    `)
  }

  const configDirectory = path.dirname(i18nOptions.configPath)
  localesDirectory = path.resolve(configDirectory, `./messages`)
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type SiteI18n implements Node {
      defaultLang: String
      prefixDefault: Boolean
      configPath: String
      config: [Locale]
      redirect: Boolean
    }
    
    type Locale {
      code: String
      hrefLang: String
      dateFormat: String
      langDir: String
      localName: String
      name: String
    }
  `)
}

exports.sourceNodes = ({ actions, createContentDigest, createNodeId }, i18nOptions) => {
  const { createNode } = actions

  const options = withDefaults(i18nOptions)
  const config = require(options.configPath)

  const configNode = {
    ...options,
    config
  }

  createNode({
    ...configNode,
    id: createNodeId(`gatsby-plugin-usei18n-config`),
    parent: null,
    children: [],
    internal: {
      type: `SiteI18n`,
      contentDigest: createContentDigest(configNode),
      content: JSON.stringify(configNode),
      description: `Options for gatsby-plugin-usei18n`
    }
  })
}

exports.onCreatePage = ({ page, actions }, i18nOptions) => {
  const { createPage, deletePage } = actions
  const { configPath, defaultLang, locales, prefixDefault, redirect } = withDefaults(i18nOptions)

  if (page.context.originalPath) {
    return
  }

  const originalPath = page.path
  deletePage(page)

  const configLocales = require(configPath)
  const languages = getLanguages({ locales: configLocales, localeStr: locales })
  const localeLangs = languages.map(l => l.code)
  const defaultLocale = getDefaultLanguage({
    locales: configLocales,
    defaultLang
  })

  const generatePage = (routed, language) => {
    const newPath = routed ? `/${language.code}${originalPath}` : originalPath
    return {
      ...page,
      path: newPath,
      // path: localizedPath({
      //   defaultLang,
      //   prefixDefault,
      //   locale: language.code,
      //   path: originalPath
      // }),
      matchPath: page.matchPath
        ? localizedPath({
            defaultLang,
            prefixDefault,
            locale: language.code,
            path: page.matchPath
          })
        : page.matchPath,
      context: {
        ...page.context,
        routed,
        redirect,
        locale: language.code,
        localeLangs: localeLangs,
        hrefLang: language.hrefLang,
        dateFormat: language.dateFormat,
        originalPath
      }
    }
  }

  const newPage = generatePage(false, defaultLocale)

  const regexp = new RegExp('404')
  if (regexp.test(newPage.path)) {
    newPage.context.routed = true
  }

  createPage(newPage)

  const routedLanguages = prefixDefault
    ? languages
    : languages.filter(language => language.code !== defaultLang)

  routedLanguages.forEach(language => {
    const localePage = generatePage(true, language)

    const regexp = new RegExp('/404/?$')
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${language.code}/*`
    }
    createPage(localePage)
  })
}

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        USEI18N_LOCALES_DIRECTORY: JSON.stringify(localesDirectory)
      })
    ]
  })
}

exports.onCreateNode = ({ node, getNode, actions }, i18nOptions) => {
  const { createNodeField } = actions

  const { defaultLang } = withDefaults(i18nOptions)

  if (node.internal.type === `Mdx` || node.internal.type === `Yaml`) {
    const fileNode = getNode(node.parent)
    const name = fileNode.name
    const isDefault = name === name.split(`.`)[0]
    const lang = isDefault ? defaultLang : name.split(`.`)[1]

    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefault`, value: isDefault })
  }
}
