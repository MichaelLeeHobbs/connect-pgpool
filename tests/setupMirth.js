const loadChannels = require('./loadChannels')
const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'

const main = async ()=> {
    await loadChannels(MIRTH_HOST)
}

main()