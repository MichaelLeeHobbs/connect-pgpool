const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'
const fetch = require('node-fetch')

const checkMirth = async (mirthHost) => {
    return fetch(`http://${mirthHost}:8080`).then(() => {
        // console.log(`Found mirth at http://${mirthHost}:8080`)
        return true
    }).catch(() => false)
}

const sleep = async (ms = 1) => new Promise(resolve => setTimeout(resolve, ms))
const main = async (attempts = 0, maxAttempts = 30, sleepMS = 2000) => {
    if ((await checkMirth(MIRTH_HOST))) return MIRTH_HOST
    if ((await checkMirth('mirth'))) return 'mirth'
    if ((await checkMirth('localhost'))) return 'localhost'
    if (attempts > maxAttempts) throw new Error(`Could not find a Mirth container! Giving up after ${maxAttempts} attempts!`)
    await sleep(sleepMS)
    return main(++attempts, maxAttempts, sleepMS)
}

module.exports = main

main().then(console.log)