/**
 cpgp.getClient(url, secret)
 client.query({query: 'sql', params: []})
 client.exec({query: 'sql', params: []})
 client.execOne({query: 'sql', params: []})
 */

const {HttpClientBuilder} = Packages.org.apache.http.impl.client
const {HttpGet, HttpPost} = Packages.org.apache.http.client.methods
const {EntityUtils} = Packages.org.apache.http.util
const {Mac, spec: {SecretKeySpec}} = Packages.javax.crypto
const {StandardCharsets} = Packages.java.nio.charset
const {StringEntity} = Packages.org.apache.http.entity

/**
 Modify the description here. Modify the function name and parameters as needed. One function per
 template is recommended; create a new code template for each new function.

 @param {String} secret - secret key
 @param {String} url - ConnectPGPool URL - for example http://cpgp:3000
 @param {String} action - query/exec/execOne
 @param {String} query - sql statement to run
 @param {Array} params - sql params
 @return {Object} returns sql result or error
 */
function cpgpExecute(args) {
    var client = new HttpClientBuilder.create().build()
    var url = args.url + '/api/' + args.action
    var httpPost = new HttpPost(url)
    var body = JSON.stringify({query: args.query, params: args.params || []})
    var request = cpgpCreateRequest(args)

    httpPost.setHeader("Content-type", "application/json")
    httpPost.setHeader("X-Signature", cpgpCreateSignature({secret: args.secret, nonce: request.nonce, text: body}))
    httpPost.setHeader("X-Request-ID", request.requestId)
    httpPost.setHeader("X-nonce", request.nonce)
    httpPost.setEntity(new StringEntity(body))

    try {
        return JSON.parse(EntityUtils.toString(client.execute(httpPost).getEntity(), "UTF-8").trim())
    } catch (e) {
        return e
    }
}

/**
 Modify the description here. Modify the function name and parameters as needed. One function per
 template is recommended; create a new code template for each new function.

 @param {String} url - ConnectPGPool URL - for example http://localhost:3000
 @return {Object} returns {requestId, nonce}
 */
function cpgpCreateRequest(params) {
    var client = new HttpClientBuilder.create().build()
    var url = params.url + '/auth/request'
    var httpGet = new HttpGet(url)

    try {
        return JSON.parse(EntityUtils.toString(client.execute(httpGet).getEntity(), "UTF-8").trim())
    } catch (e) {
        return e
    }
}

const HMAC_SHA512 = "HmacSHA512"
const getBytes = (val) => Packages.java.lang.String(val).getBytes(StandardCharsets.UTF_8)

/**
 Creates a Connect PGPool crypto signature

 @param {String} key - secret key
 @param {String} nonce - onetime nonce
 @return {String} return Base64 sha512 signature
 */
function cpgpCreateSignature(params) {
    var byteKey = getBytes(params.secret)
    var sha512Hmac = Mac.getInstance(HMAC_SHA512)
    sha512Hmac.init(new SecretKeySpec(byteKey, HMAC_SHA512))
    var macData = sha512Hmac.doFinal(getBytes(params.nonce + params.text))
    return Packages.java.util.Base64.getEncoder().encodeToString(macData)
}

/**
 Returns a Connect PGPool Client

 @param {String} url - ConnectPGPool URL - for example http://cpgp:3000
 @param {String} secret - preshared secret
 @return {String} return description
 */
function cpgpGetClient(url, secret) {
    return {
        query: (args)=>cpgpExecute({url: url, secret: secret, action: 'query', query: args.query, params: args.params}),
        exec: (args)=>cpgpExecute({url: url, secret: secret, action: 'exec', query: args.query, params: args.params}),
        execOne: (args)=>cpgpExecute({url: url, secret: secret, action: 'execOne', query: args.query, params: args.params}),
    }
}


const cpgp = {
    getClient: cpgpGetClient,
}
