const printBuildParam = require('./print-build-param.js')

module.exports = function setAppParameters(standalone, config) {
    process.env.PUBLIC_URL = process.env.PUBLIC_URL || '.'
    printBuildParam('PUBLIC_URL', process.env.PUBLIC_URL)

    if (
        standalone === false ||
        (typeof standalone === 'undefined' && !config.standalone)
    ) {
        const defaultBase = config.coreApp ? `..` : `../../..`
        process.env.DHIS2_BASE_URL = process.env.DHIS2_BASE_URL || defaultBase

        printBuildParam('DHIS2_BASE_URL', process.env.DHIS2_BASE_URL)
    } else {
        printBuildParam('DHIS2_BASE_URL', '<standalone>')
    }
}
