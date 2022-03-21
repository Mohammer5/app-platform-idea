const { exec } = require('@dhis2/cli-helpers-engine')
const { getPWAEnvVars } = require('../pwa')
const bootstrap = require('./bootstrap')
const getEnv = require('./env')

module.exports = ({ config, paths }) => ({
    craStart: async ({ port, commandArgs }) => {
        await exec({
            cmd: 'yarn',
            args: [
                'react-scripts',
                'start',
                ...commandArgs,
                ...[port ? ['--port', port] : []]
            ],
            cwd: paths.base,
            env: getEnv({ name: config.title, port, ...getPWAEnvVars(config) }),
            pipe: true,
        })
    },

    craStart: async ({ port }) => {
        await exec({
            cmd: 'yarn',
            args: ['react-scripts', 'start'],
            cwd: paths.base,
            env: getEnv({ name: config.title, port, ...getPWAEnvVars(config) }),
            pipe: true,
        })
    },

    packApp: async () => {
        await exec({
            cmd: 'yarn',
            args: ['pack'],
            cwd: paths.base,
            env: getEnv({ name: config.title }),
            pipe: false,
        })
    }
})
