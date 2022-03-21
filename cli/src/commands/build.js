const path = require('path')
const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const fs = require('fs-extra')
const { compile } = require('../lib/compiler')
const exitOnCatch = require('../lib/exitOnCatch')
const generateManifests = require('../lib/generateManifests')
const loadEnvFiles = require('../lib/loadEnvFiles')
const parseConfig = require('../lib/parseConfig')
const makePaths = require('../lib/paths')
const { injectPrecacheManifest } = require('../lib/pwa')
const makeShell = require('../lib/shell')
const { validatePackage } = require('../lib/validatePackage')
const setAppParameters = require('./build/set-app-parameters.js')
const i18n = require('../lib/i18n')
const getMode = require('./build/get-mode.js')
const buildApp = require('./build/build-app.js')
const buildLib = require('./build/build-lib.js')

const handler = async options => {
    const paths = makePaths(options.cwd || process.cwd())
    const mode = getMode({ mode: options.mode, dev: options.dev })

    loadEnvFiles(paths, mode)

    const config = parseConfig(paths)
    const shell = makeShell({ config, paths })

    exitOnCatch(
        async () => {
            const { verify } = options
            await fs.remove(paths.buildOutput)

            validatePackage({ config, paths, verify })

            reporter.info('Generating internationalization strings...')
            await i18n.extractAndGenerate(paths)

            const { type, name } = config
            reporter.info(`Building ${type} ${chalk.bold(name)}...`)
            
            const patchedOptions = {
              ...options,
              cwd: options.cwd || process.cwd(),
              paths,
              mode,
              config,
              shell,
            }

            if (config.type === 'app') {
                await buildApp(patchedOptions)
            } else {
                await buildLib(patchedOptions)
            }
        },
        {
            name: 'build',
            onError: () => reporter.error('Build script failed'),
        }
    )
}

const command = {
    aliases: 'b',
    desc: 'Build a production app bundle for use with the DHIS2 app-shell',
    builder: {
        mode: {
            description: 'Specify the target build environment',
            aliases: 'm',
            choices: ['development', 'production'],
            defaultDescription: 'production',
        },
        dev: {
            type: 'boolean',
            description: 'Build in development mode',
            conflicts: 'mode',
        },
        verify: {
            type: 'boolean',
            description: 'Validate package before building',
            default: true,
        },
        watch: {
            type: 'boolean',
            description: 'Watch source files for changes',
            default: false,
        },
        pack: {
            type: 'boolean',
            description: 'Create a .zip archive of the built application',
            default: true,
        },
        standalone: {
            type: 'boolean',
            description:
                'Build in standalone mode (overrides the d2.config.js setting)',
            default: undefined,
        },
    },
    handler,
}

module.exports = command
