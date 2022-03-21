const { reporter, chalk } = require('@dhis2/cli-helpers-engine')
const detectPort = require('detect-port')
const createProxyServerOrig = require('../../lib/proxy')

module.exports = async function createProxyServer({
  proxyPort,
  proxy,
  appPort,
}) {
    if (!proxy) {
        return
    }

    const newProxyPort = await detectPort(proxyPort)
    const proxyBaseUrl = `http://localhost:${newProxyPort}`

    reporter.print('')
    reporter.info('Starting proxy server...')
    reporter.print(
        `The proxy for ${chalk.bold(
            proxy
        )} is now available on port ${newProxyPort}`
    )
    reporter.print('')

    createProxyServerOrig({
        target: proxy,
        baseUrl: proxyBaseUrl,
        port: newProxyPort,
        shellPort: appPort,
    })
}
