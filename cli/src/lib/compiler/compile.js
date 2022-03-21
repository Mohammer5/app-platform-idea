const path = require('path')
const babel = require('@babel/core')
const { reporter, prettyPrint } = require('@dhis2/cli-helpers-engine')
const chokidar = require('chokidar')
const fs = require('fs-extra')
const makeBabelConfig = require('../../../config/makeBabelConfig.js')
const {
    verifyEntrypoints,
    overwriteAppEntrypoint,
} = require('./entrypoints.js')
const {
    extensionPattern,
    normalizeExtension,
} = require('./extensionHelpers.js')

const compileFiles = ({ inputDir, outputDir, processFileCallback }) => {
    const compileFile = async source => {
        const relative = normalizeExtension(path.relative(inputDir, source))
        const destination = path.join(outputDir, relative)
        reporter.debug(
            `File ${relative} changed or added... dest: `,
            path.relative(inputDir, destination)
        )
        await fs.ensureDir(path.dirname(destination))
        await processFileCallback(source, destination)
    }

    const removeFile = async file => {
        const relative = path.relative(inputDir, file)
        const outFile = path.join(outputDir, relative)
        reporter.debug(`File ${relative} removed... removing: `, outFile)
        fs.remove(outFile)
    }

    return new Promise((resolve, reject) => {
        const watcher = chokidar.watch(inputDir, { persistent: true })

        watcher
            .on('ready', async () => {
                await watcher.close()
                resolve()
            })
            .on('add', compileFile)
            .on('change', compileFile)
            .on('unlink', removeFile)
            .on('error', error => {
                reporter.debugErr('Chokidar error:', error)
                reject('Chokidar error!')
            })

        process.on('SIGINT', async () => {
            reporter.debug('Caught interrupt signal')
            await watcher.close()
        })
    })
}

const copyFile = async (source, destination) => {
    await fs.copy(source, destination)
}

const compileFile = babelConfig => async (source, destination) => {
    if (source.match(extensionPattern)) {
        try {
            const result = await babel.transformFileAsync(
                source,
                babelConfig
            )
            await fs.writeFile(destination, result.code)
        } catch (err) {
            reporter.dumpErr(err)
            reporter.error(
                `Failed to compile ${prettyPrint.relativePath(
                    source
                )}. Fix the problem and save the file to automatically reload.`
            )
        }
    } else {
        await copyFile(source, destination)
    }
}

const compile = async ({
    config,
    paths,
    moduleType = 'es',
    mode = 'development',
}) => {
    verifyEntrypoints({ config, paths })

    const isApp = config.type === 'app'
    const outDir = path.join(paths.buildOutput, moduleType)

    const babelConfig = makeBabelConfig({ moduleType, mode })
    const processFileCallback = compileFile.bind(null, babelConfig)

    return compileFiles({
        inputDir: paths.src,
        outputDir: outDir,
        processFileCallback,
    })
}

module.exports = compile
