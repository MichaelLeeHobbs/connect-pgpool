const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'
const loadChannels = require('./loadChannels')
const waitForMirth = require('./waitForMirth')


const main = async ()=> {
    await waitForMirth(MIRTH_HOST)
    await loadChannels(MIRTH_HOST)
}

main()