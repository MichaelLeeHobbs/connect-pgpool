const fetch = require('node-fetch')
const findMirth = require('../../findMirth')
let mirthHost = process.env.MIRTH_HOST || 'localhost'

beforeAll(async () => {
    mirthHost = await findMirth()
})
describe('TestInterface > echo', () => {
    it(`should return original message`, async () => {
        expect.assertions(1)
        let body = `()=>'pong'`
        let result = await fetch(`http://${mirthHost}:5000`, {method: 'POST', body, headers: {"content-type": "application/json"}}).then(res => res.json())
        expect(result).toStrictEqual({"result": "pong"})
    })
})