const loadChannels = require('./loadChannels')
const waitForMirth = require('./waitForMirth')
const findMirth = require('./findMirth')


const main = async ()=> {
    let mirthHost = await findMirth()
    await waitForMirth(mirthHost)
    await loadChannels(mirthHost)
}

main()