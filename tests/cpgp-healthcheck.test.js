const fetch = require('node-fetch')
const MIRTH_HOST = process.env.MIRTH_HOST || 'localhost'

beforeAll(() => {

})
describe('channel: TestInterface', () => {
    it(`should return ok`, async () => {
        expect.assertions(1)
        const testCode = '' +
            `
()=>{
    const {HttpClientBuilder} = Packages.org.apache.http.impl.client
    const {HttpGet, HttpPost} = Packages.org.apache.http.client.methods
    const {EntityUtils} = Packages.org.apache.http.util
    const {Mac, spec: {SecretKeySpec}} = Packages.javax.crypto
    const {StandardCharsets} = Packages.java.nio.charset
    const {StringEntity} = Packages.org.apache.http.entity
    
    var client = new HttpClientBuilder.create().build()
    var url = 'http://cpgp:3000/healthcheck'
    var httpGet = new HttpGet(url)
    
    try {
        return EntityUtils.toString(client.execute(httpGet).getEntity(), "UTF-8").trim()
    } catch (e) {
        return e
    }
}
`

        let body = testCode.trim()
        let result = await fetch(`http://${MIRTH_HOST}:5000`, {method: 'POST', body, headers: {"content-type": "script/javascript"}}).then(res => res.json())
        expect(result).toEqual({"result": "ok"})
    })
})