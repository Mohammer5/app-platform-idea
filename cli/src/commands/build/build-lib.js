const { compile } = require('../../lib/compiler')

module.exports = async function({ watch, verify, paths, mode, config }) {
    const compileOptions = { config, paths, mode, watch }
    await Promise.all([
        compile({ ...compileOptions, moduleType: 'es' }),
        compile({ ...compileOptions, moduleType: 'cjs' }),
    ])
}
