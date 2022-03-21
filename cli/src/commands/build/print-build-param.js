const { reporter, chalk } = require('@dhis2/cli-helpers-engine')

module.exports = function printBuildParam(key, value) {
    reporter.print(chalk.green(` - ${key} :`), chalk.yellow(value))
}
