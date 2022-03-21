const path = require('path')
const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const fs = require('fs-extra')
const { normalizeExtension } = require('./extensionHelpers.js')

const verifyEntrypoint = ({ entrypoint, basePath, resolveModule }) => {
    if (!entrypoint.match(/^(\.\/)?src\//)) {
        const msg = `Entrypoint ${chalk.bold(
            entrypoint
        )} must be located within the ${chalk.bold('./src')} directory`
        reporter.error(msg)
        throw new Error(msg)
    }

    try {
        resolveModule(path.join(basePath, entrypoint))
    } catch (e) {
        const msg = `Could not resolve entrypoint ${chalk.bold(entrypoint)}`
        reporter.error(msg)
        throw new Error(msg)
    }
}

const verifyLibraryEntrypoint = (paths, resolveModule, entrypoint) => {
    if (typeof entrypoint === 'string') {
        return verifyEntrypoint({
            entrypoint,
            basePath: paths.base,
            resolveModule,
        })
    }

    if (typeof entrypoint === 'object') {
        return Object.values(entrypoint).forEach(verifyLibraryEntrypoint)
    }

    const msg = `${chalk.bold(entrypoint)} is not a valid entrypoint`
    reporter.error(msg)
    throw new Error(msg)
}

const verifyAppEntrypoint = (config, paths, resolveModule) => {
    verifyEntrypoint({
        entrypoint: config.entryPoints.app,
        basePath: paths.base,
        resolveModule,
    })
}

exports.verifyEntrypoints = ({
    config,
    paths,
    resolveModule = require.resolve,
}) => config.type === 'app'
    ? verifyAppEntrypoint(config, paths, resolveModule)
    : verifyLibraryEntrypoint(
        paths,
        resolveModule,
        config.entryPoints.lib
    )
