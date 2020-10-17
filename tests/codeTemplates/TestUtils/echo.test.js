const fetch = require('node-fetch')
const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'

describe('TestInterface > echo', () => {
    it(`should return original message`, async () => {
        expect.assertions(1)
        let body = `()=>'pong'`
        let result = await fetch(`http://${MIRTH_HOST}:5000`, {method: 'POST', body, headers: {"content-type": "application/json"}}).then(res => res.json())
        expect(result).toStrictEqual({"result": "pong"})
    })
})