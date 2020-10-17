const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'
const fetch = require('node-fetch')

const checkMirth = async (mirthHost) => fetch(`http://${mirthHost}:8080`).then(() => true).catch(()=>false)

const main = async () => {
    if(await checkMirth(MIRTH_HOST)) return MIRTH_HOST
    if(await checkMirth('localhost')) return 'localhost'
    if(await checkMirth('mirth')) return 'mirth'
}

module.exports = main