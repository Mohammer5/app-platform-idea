const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const printBuildParam = require('./print-build-param.js')

const getNodeEnv = () => {
    let nodeEnv = process.env['NODE_ENV']
    if (nodeEnv) {
        nodeEnv = nodeEnv.toLowerCase()
        if (buildModes.includes(nodeEnv)) {
            return nodeEnv
        }
    }
    return null
}

module.exports = function getMode({ mode, dev }) {
    let finalMode = (
        mode ||
        (dev && 'development') ||
        (getNodeEnv() || 'production')
    )

    reporter.print(chalk.green.bold('Build parameters:'))
    printBuildParam('Mode', finalMode)

    return finalMode
}
