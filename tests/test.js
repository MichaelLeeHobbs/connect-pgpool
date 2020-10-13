const fetch = require('node-fetch')
beforeAll(() => {
    // doesnt work
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
})
describe('Connect Server', () => {
    describe('HTTP(S)', () => {
        it(`http://localhost:8080 responds with status 200`, async () => {
            expect.assertions(1)
            let result = await fetch('http://localhost:8080').then(res=>res.status)
            expect(result).toBe(200)
        })
        it(`https://localhost:8443 responds with status 200`, async () => {
            expect.assertions(1)
            let result = await fetch('https://localhost:8443').then(res=>res.status)
            expect(result).toBe(200)
        })
    })
})