const fetch = require('node-fetch')

const sleep = async (ms = 1) => new Promise(resolve => setTimeout(resolve, ms))

const isMirthReady = async (mirthHost) => fetch(`https://${mirthHost}:8443`).then(async (res) => (await res.text()).includes('Mirth Connect Administrator'))

const main = async (mirthHost, attempts = 0, maxAttempts = 30, sleepMS = 2000) => {
    let ready = await isMirthReady(mirthHost)
    if (ready) return 'Ready'
    if (attempts > maxAttempts) throw new Error(`Mirth container is not ready! Giving up after ${maxAttempts} attempts!`)
    await sleep(sleepMS)
    return main(mirthHost, ++attempts, maxAttempts, sleepMS)
}

module.exports = main