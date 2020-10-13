const fetch = require('node-fetch')


beforeAll(() => {

})
describe('channel: cpgp-healthcheck', () => {
    it(`should return ok`, async () => {
        expect.assertions(1)
        let body = JSON.stringify({"channelName" : "cpgp-healthcheck","message" : "test"})
        let result = await fetch('http://localhost:5002', {method: 'POST', body, headers: {"content-type": "application/json"}}).then(res=>res.text())
        expect(result).toBe('ok')
    })
})