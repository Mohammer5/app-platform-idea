const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const {
  validatePackage: validatePackageOrig,
} = require('../../lib/validatePackage')

module.exports = async function validatePackage({ config, paths }) {
    if (!(await validatePackageOrig({ config, paths, offerFix: false }))) {
        reporter.print(
            'Package validation issues are ignored when running "d2-app-scripts start"'
        )
        reporter.print(
            `${chalk.bold(
                'HINT'
            )}: Run "d2-app-scripts build" to automatically fix some of these issues`
        )
    }
}
