const { reporter } = require('@dhis2/cli-helpers-engine')
const { validatePackage: validatePackageOrig } = require('../../lib/validatePackage')

module.exports = async function validatePackage({ config, paths, verify }) {
  if (
      !(await validatePackageOrig({
          config,
          paths,
          offerFix: !process.env.CI,
          noVerify: !verify,
      }))
  ) {
      reporter.error(
          'Failed to validate package, use --no-verify to skip these checks'
      )
      process.exit(1)
  }
}
