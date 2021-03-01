const { MetaMaskInpageProvider: MetaMaskInpageProviderV7 } = require('@dimensiondev/inpage-provider-7')
const { MetaMaskInpageProvider: MetaMaskInpageProviderV8 } = require('@dimensiondev/inpage-provider-8')
const PortStream = require('extension-port-stream')
const { detect } = require('detect-browser')
const browser = detect()
const config = require('./config.json')

function checkAvailability(provider) {
  return new Promise((resolve) => {
    try {
      provider.request({ method: 'net_version' }).then(() => resolve(true)).catch(() => resolve(false))
      setTimeout(() => resolve(false), 1000)
    } catch (e) {
      resolve(false)
    }
  })
}

function getMetaMaskId () {
  switch (browser && browser.name) {
    case 'chrome':
      return config.CHROME_ID
    case 'firefox':
      return config.FIREFOX_ID
    default:
      return config.CHROME_ID
  }
}

async function createMetaMaskProvider() {
  let provider
  try {
    let currentMetaMaskId = getMetaMaskId()
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId)
    const pluginStream = new PortStream(metamaskPort)
    provider = new MetaMaskInpageProviderV8(pluginStream)
    if (!(await checkAvailability(provider))) provider = new MetaMaskInpageProviderV7(pluginStream)
    if (!(await checkAvailability(provider))) throw new Error('Failed to create provider.')
 } catch (error) {
    throw error
  }
  return provider
}

module.exports = createMetaMaskProvider