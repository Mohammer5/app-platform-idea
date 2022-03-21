const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const detectPort = require('detect-port')
const { compile } = require('../lib/compiler')
const exitOnCatch = require('../lib/exitOnCatch')
const generateManifests = require('../lib/generateManifests')
const i18n = require('../lib/i18n')
const loadEnvFiles = require('../lib/loadEnvFiles')
const parseConfig = require('../lib/parseConfig')
const makePaths = require('../lib/paths')
const { compileServiceWorker } = require('../lib/pwa')
const makeShell = require('../lib/shell')
const createProxyServer = require('./start/create-proxy-server.js')
const validatePackage = require('./start/validate-package.js')
const validateTypeApp = require('./start/validate-type-app.js')

const defaultPort = 3000

const handler = async argv => {
    const {
        cwd,
        force,
        port = process.env.PORT || defaultPort,
        shell: shellSource,
        proxy,
        proxyPort,
    } = argv

    const commandArgs = process.argv.slice(3)

    await exitOnCatch(
        async () => {
            const paths = makePaths(cwd)
            const mode = 'development'

            loadEnvFiles(paths, mode)

            const config = parseConfig(paths)
            const shell = makeShell({ config, paths })

            validateTypeApp(config)

            const appPort = await detectPort(port)

            await createProxyServer({ proxyPort, proxy, appPort })
            await validatePackage({ config, paths, offerFix: false })

            reporter.info('Generating internationalization strings...')
            await i18n.extractAndGenerate(paths)
        },
        {
            name: 'start',
            onError: () =>
                reporter.error('Start script exited with non-zero exit code'),
        }
    )
}

// @TODO: make sure this still works
// // Manifests added here so app has access to manifest.json for pwa
// reporter.info('Generating manifests...')
// await generateManifests(paths, config, process.env.PUBLIC_URL)

// @TODO: make sure this still works
// if (config.pwa.enabled) {
//     reporter.info('Compiling service worker...')
//     await compileServiceWorker({
//         config,
//         paths,
//         mode: 'development',
//     })
// }

const command = {
    command: 'prestart',
    aliases: 's',
    desc: 'Start a development server running a DHIS2 app within the DHIS2 app-shell',
    builder: {
        port: {
            alias: 'p',
            type: 'number',
            description: 'The port to use when running the development server',
        },
        proxy: {
            alias: 'P',
            type: 'string',
            description: 'The remote DHIS2 instance the proxy should point to',
        },
        proxyPort: {
            type: 'number',
            description: 'The port to use when running the proxy',
            default: 8080,
        },
    },
    handler,
}

module.exports = command
