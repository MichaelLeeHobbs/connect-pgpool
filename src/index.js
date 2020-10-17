const CONFIG = require('./config.js')
const express = require('express')
const app = express()
const morgan = require('morgan')
const http = require('http').createServer(app)
const db = require('./db')
const APIAuth = require('./APIAuth')

let apiAuth = new APIAuth({requestTimeout: CONFIG.REQUEST_TIMEOUT})

app.use(express.json({limit: '50mb'}))
app.use(morgan('combined'))

app.get('/healthcheck', (req, res) => res.status(200).send('ok').end())

app.get('/auth/request', (req, res) => res.status(200).json(apiAuth.createRequest()).end())

app.post('/api/:action', (req, res) => {
    console.log(`headers: `, req.headers)
    let requestId = req.headers["x-request-id"]
    let signature = req.headers["x-signature"]
    let {action} = req.params
    let {query, params = []} = req.body
    let message = JSON.stringify(req.body)
    let isValid = apiAuth.validateRequest(requestId, CONFIG.PRIVATE_KEY, message, signature)
    if (!isValid) {
        // todo would like to do more but not sure what as the IP will be masked
        console.error('INVALID REQUEST!')
        return res.status(404).end()
    }


    if (!db[action]) return res.status(400).end()
    db[action]({query, params})
        .then(result=>res.json(result).end())
        .catch((e)=>{
            let {message, stack} = e
            console.error(e)
            res.status(500).json({message, stack}).end()
        })
})

// app.use('/plugin/test', require('./plugins/test'))

http.listen(CONFIG.PORT, function () {
    console.log(`listening on *:${CONFIG.PORT}`)
})

