const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'
const fetch = require('node-fetch')

const checkMirth = async (mirthHost) => {
    return fetch(`http://${mirthHost}:8080`).then(() => {
        console.log(`Found mirth at http://${mirthHost}:8080`)
        return true
    }).catch(() => false)
}

const main = async () => {
    if ((await checkMirth(MIRTH_HOST))) return MIRTH_HOST
    if ((await checkMirth('localhost'))) return 'localhost'
    if ((await checkMirth('mirth'))) return 'mirth'
    return MIRTH_HOST
}

module.exports = main