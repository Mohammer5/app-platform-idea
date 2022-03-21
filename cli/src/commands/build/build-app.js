const path = require('path')
const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const fs = require('fs-extra')
const { compile } = require('../../lib/compiler')
const exitOnCatch = require('../../lib/exitOnCatch')
const generateManifests = require('../../lib/generateManifests')
const i18n = require('../../lib/i18n')
const { injectPrecacheManifest } = require('../../lib/pwa')
const { handler: pack } = require('../pack.js')
const validatePackage = require('./validate-package.js')
const setAppParameters = require('./set-app-parameters.js')
const buildLib = require('./build-lib.js')

module.exports = async function(options) {
    const packAppOutput = options.pack
    const { config, cwd, paths, standalone, mode, shell } = options

    await fs.remove(paths.buildAppBundleLocation)
    setAppParameters(standalone, config)
    await buildLib(options)

    // @TODO: Figure out if this is something CRA already takes care of
    // // Manifest generation moved here so these static assets can be
    // // precached by Workbox during the shell build step
    // const { shell } = options
    // reporter.info('Generating manifests...')
    // await generateManifests(paths, config, process.env.PUBLIC_URL)
    // // CRA Manages service worker compilation here
    // reporter.info('Building appShell...')
    // await shell.build()

    // @TODO: Figure out if this is something CRA already takes care of
    // if (config.pwa.enabled) {
    //     reporter.info('Injecting precache manifest...')
    //     await injectPrecacheManifest(paths, config)
    // }
    //
    // if (!fs.pathExistsSync(paths.shellBuildOutput)) {
    //     reporter.error('No build output found')
    //     process.exit(1)
    // }
    //
    // await fs.copy(paths.shellBuildOutput, paths.buildAppOutput)

    if (packAppOutput) {
        await shell.packApp()
    }

    reporter.print(chalk.green('\n**** DONE! ****'))
}
