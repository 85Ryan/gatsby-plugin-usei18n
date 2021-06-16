# gatsby-plugin-useI18n

Internationalize your Gatsby site.

## Introduction

This plugin is modified from these two awesome official themes: [gatsby-theme-i18n](https://www.gatsbyjs.com/plugins/gatsby-theme-i18n) and [gatsby-theme-i18n-react-intl](https://www.gatsbyjs.com/plugins/gatsby-theme-i18n-react-intl). Before this, I used these two themes to internationalize my Gatsby site, but I found that they can't fully meet my needs. So I made this for my personal site and put everything I learned in this Gatsby plugin in hopes to help out anyone who may struggle with the same.

## Features

- Internationalize your Gatsby site powered by [react-intl](https://formatjs.io/docs/react-intl).
- Creating prefixed, enriched pages for each language (including client-only pages that have a matchPath).
- Automatic redirection based on the user's preferred language in browser.
- Adds `<link rel="alternate" />` seo tags to `<head>`.
- Exports useful React components and hooks.

## Installation

1. Install `gatsby-plugin-usei18n` and its peerDependencies:

  ```shell
  npm install gatsby-plugin-usei18n react-intl gatsby-plugin-react-helmet react-helmet --save
  ```

  or

  ```shell
  yarn add gatsby-plugin-usei18n react-intl gatsby-plugin-react-helmet react-helmet
  ```

2. Add the configuration to your `gatsby-config.js` file:

  ```javascript
  module.exports = {
    plugins: [
      {
        resolve: `gatsby-plugin-usei18n`,
        options: {
          defaultLang: `en`,
          configPath: require.resolve(`./i18n/config.json`),
        },
      },
    ],
  }
  ```

3. Create the folder `i18n` at the root of your project and create a file called `config.json` in it.

4. Add your locales to the config file and fill out these information:

  - `code`: The ISO 3166-1 alpha-2 code which will be used for the path prefix, as a unique identifier (e.g. for the `defaultLang` option)
  - `hrefLang`: The IETF language tag for the `<html lang="xx-XX" />` attribute. Also used for og tags
  - `name`: The english name of the locale
  - `localName`: The local name of the locale
  - `langDir`: The direction of language (e.g. "ltr", "rtl")
  - `dateFormat`: The tokens that [Moment.js](https://momentjs.com/docs/#/parsing/string-format/) accepts for date formatting. This can be used for dates on GraphQL queries

  Example config of English:

  ```json
  [
    {
      "code": "en",
      "hrefLang": "en-US",
      "name": "English",
      "localName": "English",
      "langDir": "ltr",
      "dateFormat": "MM/DD/YYYY"
    }
  ]
  ```

5. Create the folder named `messages` in the `configPath` (e.g. `./i18n/`) and create your `<locale>.json` files in it.

6. Add a suffix/postfix to your MDX/YAML filenames, e.g. if you have your blogposts at `content/posts/my-title/index.mdx` you'll need to copy that file and place it with `index.de.mdx` in the same folder.

## Usage

By adding a suffix/postfix in your filenames you can define the locale that the document is in.

You can also see the [example](https://github.com/85Ryan/example-usei18n.git) to learn more.

### Plugins Options

| Key             | Default Value | Description                                                                                                                               |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultLang`   | `en`          | The locale that is your default language. For this language no prefixed routes will be created unless you set the option `prefixDefault`. |
| `prefixDefault` | `false`       | All routes will be prefixed, including the `defaultLang`                                                                                  |
| `configPath`    | none          | Path to the config file                                                                                                                   |
| `locales`       | `null`        | A string of locales (divided by spaces) to only build a subset of the locales defined in `configPath`, e.g. `en de`                       |
| `redirect`      | `false`       | if the value is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g. `/en` or `/en/page-2`. Otherwise, the pages will render `defaultLang` language. |

You can pass additional options in as they'll be forwarded to the plugin. You can query all options in GraphQL on the `SiteI18n` type.

### Available React components/hooks

The plugin also exports a couple of components and hooks that you could use in your project.

#### useLocalization

The plugin saves its information into a custom `SiteI18n` graphql type which you can access via the `useLocalization` hook. Furthermore, you're able to ask for the current locale via React context.

Example:

```javascript
import React from "react"
import { useLocalization } from "gatsby-plugin-usei18n"

const Example = () => {
  const { locale, config, defaultLang } = useLocalization()

  return (
    <div>
      <div>Current locale: {locale}</div>
      <div>Current defaultLang: {defaultLang}</div>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  )
}

export default Example
```

#### LangSelector

This is a component that can create a language selector.

Example:

```javascript
import React from "react";
import { LangSelector, LocaleContext } from "gatsby-plugin-usei18n";

const Example = ({ pageContext }) => {
  const { handleLanguage } = React.useContext(LocaleContext);
  const path = pageContext.originalPath;
  return (
    <div>
      <LangSelector
        path={path}
        toggleLanguage={handleLanguage}
      />
    </div>
  )
}

export default Example
```

Render HTML:

```html
<div>
  <ul>
    <li>
      <a href="/">English</a>
    </li>
    <li>
      <a href="/de/">Deutsch</a>
    </li>
    ...
  </ul>
</div>
```

#### LocalizedLink

This is a wrapper around the `Link` component from `gatsby` and is transforming links to the correct path by accessing the current locale via React context.

Example:

```javascript
import React from "react"
import { LocalizedLink as Link } from "gatsby-plugin-usei18n"

const Example = () => {
  return (
    <div>
      <Link to="/page-2/">Link to second page</Link>
    </div>
  )
}

export default Example
```

#### LocalizedRouter

Provides a `<Router />` from `@reach/router` that prefixes the `basePath` prop with the current locale.

Example:

```javascript
import React from "react"
import { LocalizedRouter } from "gatsby-plugin-usei18n"
import Detail from "../components/detail"

const App = () => {
  return (
    <LocalizedRouter basePath="/app">
      <Detail path="/:id" />
    </LocalizedRouter>
  )
}

export default App
```

#### MdxLink

This is a component specifically for MDX to replace the normal anchor tag. This way local links to other files are automatically localized (as it uses `LocalizedLink` behind the scenes).

Example:

```javascript
import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { MdxLink } from "gatsby-plugin-usei18n"

const components = {
  a: MdxLink,
}

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <main>
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
    </React.Fragment>
  )
}

export default Layout
```

#### LocaleContext / LocaleProvider

You can also directly access the `LocaleContext` and `LocaleProvider` from the plugin.

Example:

```javascript
import React from "react"
import { LocaleContext } from "gatsby-plugin-usei18n"

const Example = () => {
  const locale = React.useContext(LocaleContext)

  return <div>Locale: {locale}</div>
}

export default Example
```

## Showcase

- [https://fclogo.top](https://fclogo.top)

*Feel free to send us PR to add your project.*

## License

[MIT](./LICENSE).