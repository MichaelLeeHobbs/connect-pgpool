process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')


const loadChannels = async (mirthHost)=> {
    const Authorization = `Basic ${(Buffer.from('admin:admin')).toString('base64')}`

    let promises = []

    const testInterface = fs.readFileSync(path.resolve(__dirname, '../channels/TestInterface.xml'), 'utf8')
    promises.push(fetch(`https://${mirthHost}:8443/api/channels`, {method: 'POST', headers: {Authorization, accept: "application/json", "Content-Type": "application/xml"}, body: testInterface})
        .then(res=>res.text())
        .then((res)=>console.log('Load testInterface results: ', res))
    )
    // .catch(console.error)

    const testRunner = fs.readFileSync(path.resolve(__dirname, '../channels/TestRunner.xml'), 'utf8')
    promises.push(fetch(`https://${mirthHost}:8443/api/channels`, {method: 'POST', headers: {Authorization, accept: "application/json", "Content-Type": "application/xml"}, body: testRunner})
        .then(res=>res.text())
        .then((res)=>console.log('Load testRunner results: ', res))
    )
    // .catch(console.error)


    const deployChannels = JSON.stringify({ "set": { "string": [ "3d194c52-0c93-4104-95cb-c4c2baaa8f85", "ac780bfa-1a27-4d37-ba85-5d57c1a4bfdd"] }})
    return Promise.all(promises)
        .then(()=>{
            return fetch(`https://${mirthHost}:8443/api/channels/_deploy?returnErrors=true`, {method: 'POST', headers: {Authorization, accept: "application/json", "Content-Type": "application/json"}, body: deployChannels})
                .then(res=>res.text())
                .then((res)=>console.log('Start TestInterface results: ', res))
                .catch((e)=>console.error('Start TestInterface error: ', e))
        })
}

module.exports = loadChannels

//curl -X POST --insecure --user admin:admin "https://localhost:8443/api/channels/_start?returnErrors=true" -H "accept: application/xml" -H "Content-Type: application/x-www-form-urlencoded" -d "channelId=3d194c52-0c93-4104-95cb-c4c2baaa8f85"
//curl -X POST --insecure --user admin:admin "https://localhost:8443/api/channels/3d194c52-0c93-4104-95cb-c4c2baaa8f85/_start?returnErrors=true" -H "accept: application/xml"
//curl -X POST "https://localhost:8443/api/channels/_deploy?returnErrors=true" -H "accept: application/xml" -H "Content-Type: application/json" -d "{ \"set\": { \"string\": [ \"3d194c52-0c93-4104-95cb-c4c2baaa8f85\" ] }}"
