const i18n = require('../../lib/i18n')

module.exports = async function generateI18n(paths) {
    await i18n.extract({
      input: paths.src,
      output: paths.i18nStrings,
      paths,
    })

    await i18n.generate({
      input: paths.i18nStrings,
      output: paths.i18nLocales,
      namespace: 'default',
      paths,
    })
}
