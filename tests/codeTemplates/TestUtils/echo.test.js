const fetch = require('node-fetch')

describe('codeTemplates > TestUtils > echo', () => {
    it(`should return original message`, async () => {
        expect.assertions(1)
        let body = JSON.stringify({"function": "echo", "params": "pong"})
        let result = await fetch('http://localhost:5000', {method: 'POST', body, headers: {"content-type": "application/json"}}).then(res => res.json())
        expect(result).toStrictEqual({"result": "pong"})
    })
})