const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const sleep = async (ms = 1) => new Promise(resolve => setTimeout(resolve, ms))

const loadChannel = ({mirthHost, Authorization, body}) => fetch(`https://${mirthHost}:8443/api/channels`, {
    method: 'POST',
    headers: {Authorization, accept: "application/json", "Content-Type": "application/xml"},
    body
})
    .then(async res => {
        let result = await res.text()
        if (result.includes('Please try again shortly.')) {
            await sleep(2000)
            return loadChannels({mirthHost, Authorization, body})
        }
        return result
    })

const loadChannels = async (mirthHost) => {
    const Authorization = `Basic ${(Buffer.from('admin:admin')).toString('base64')}`

    let promises = []

    const testInterface = fs.readFileSync(path.resolve(__dirname, '../channels/TestInterface.xml'), 'utf8')
    promises.push(loadChannel({mirthHost, Authorization, body: testInterface}).then((res) =>console.log('Load testInterface results: ', res)))
    // .catch(console.error)

    const testRunner = fs.readFileSync(path.resolve(__dirname, '../channels/TestRunner.xml'), 'utf8')
    promises.push(loadChannel({mirthHost, Authorization, body: testRunner}).then((res) =>console.log('Load testInterface results: ', res)))

    const deployChannels = JSON.stringify({"set": {"string": ["3d194c52-0c93-4104-95cb-c4c2baaa8f85", "ac780bfa-1a27-4d37-ba85-5d57c1a4bfdd"]}})
    return Promise.all(promises)
        .then(() => {
            return fetch(`https://${mirthHost}:8443/api/channels/_deploy?returnErrors=true`, {
                method: 'POST',
                headers: {Authorization, accept: "application/json", "Content-Type": "application/json"},
                body: deployChannels
            })
                .then(async res => {
                    console.log('Start TestInterface results: ', await res.text())
                    await sleep(2000)
                })
                .catch((e) => console.error('Start TestInterface error: ', e))
        })
        .catch(e => {
            console.error('Error while loading/deploying channels!', e)
            throw e
        })
}

module.exports = loadChannels

// curl --insecure https://localhost:8443
// curl http://localhost:8080
//curl -X POST --insecure --user admin:admin "https://localhost:8443/api/channels/_start?returnErrors=true" -H "accept: application/xml" -H "Content-Type: application/x-www-form-urlencoded" -d "channelId=3d194c52-0c93-4104-95cb-c4c2baaa8f85"
//curl -X POST --insecure --user admin:admin "https://localhost:8443/api/channels/3d194c52-0c93-4104-95cb-c4c2baaa8f85/_start?returnErrors=true" -H "accept: application/xml"
//curl -X POST "https://localhost:8443/api/channels/_deploy?returnErrors=true" -H "accept: application/xml" -H "Content-Type: application/json" -d "{ \"set\": { \"string\": [ \"3d194c52-0c93-4104-95cb-c4c2baaa8f85\" ] }}"
