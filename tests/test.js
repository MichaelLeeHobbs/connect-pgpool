const fetch = require('node-fetch')
const findMirth = require('./findMirth')
let mirthHost = process.env.MIRTH_HOST

beforeAll(async () => {
    mirthHost = await findMirth()
})
describe('Connect Server', () => {
    describe('HTTP(S)', () => {
        it(`http://${mirthHost}:8080 responds with status 200`, async () => {
            expect.assertions(1)
            console.log(`mirthHost: ${mirthHost}`)
            let result = await fetch(`http://${mirthHost}:8080`).then(res=>res.status)
            expect(result).toBe(200)
        })
        it(`https://${mirthHost}:8443 responds with status 200`, async () => {
            expect.assertions(1)
            let result = await fetch(`https://${mirthHost}:8443`).then(res=>res.status)
            expect(result).toBe(200)
        })
    })
})