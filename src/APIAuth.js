const crypto = require("crypto")

module.exports = class APIAuth {
    constructor({requestTimeout}) {
        this.request = new Map()
        this.requestTimeout = requestTimeout || 60 * 1000
    }

    getRequestId() {
        let id = String(Math.random()).split('.')[1]
        if (this.request.has(id)) return this.getRequestId()
        return id
    }

    createRequest() {
        let requestId = this.getRequestId()
        let nonce = String(Math.random()).split('.')[1]
        this.request.set(requestId, nonce)
        setTimeout(() => this.request.delete(requestId), this.requestTimeout)
        return {requestId, nonce}
    }

    validateRequest(requestId, privateKey, message, signature) {
        if (!this.request.has(requestId)) return false
        let nonce = this.request.get(requestId)
        console.log({requestId, privateKey, message, signature, nonce})
        this.request.delete(requestId)

        let computedSignature = crypto.createHmac("sha512", privateKey).update(`${nonce}${message}`).digest("base64")
        const computedSignatureBuffer = Buffer.from(computedSignature, 'base64')
        const retrievedSignatureBuffer = Buffer.from(signature, 'base64')
        console.log(`${computedSignature} ?== ${signature}`)

        // Compare signatures.
        let isValid = crypto.timingSafeEqual(computedSignatureBuffer, retrievedSignatureBuffer) === true

        if (!isValid) console.log(`Invalid Signature! Expected: ${computedSignature} Received: ${signature}`)
        return isValid
    }
}