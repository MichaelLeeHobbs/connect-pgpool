const pg = require('pg')
const {POSTGRES} = require('./config')

class DB {
    constructor() {
        this.pool = new pg.Pool(POSTGRES)
        const handleError = (err) => {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            console.error('PGQuery.construction - idle client error', err.message, err.stack)
            try {
                this.pool.end()
            } catch (e) {
                console.error('PGQuery.construction - this.pool.end()', err.message, err.stack)
            } finally {
                //delete pool // todo may not need this
                this.pool = new pg.Pool(POSTGRES)
                this.pool.on('error', handleError)
                console.log('PGQuery.construction recreated pool after error.')
            }
        }
        this.pool.on('error', handleError)
    }

    query({query, params}) {
        if (!query) throw new Error('query cannot be null or undefined.')
        return new Promise(((resolve, reject) => {
            // to run a query we can acquire a client from the pool,
            // run a query on the client, and then return the client to the pool
            this.pool.connect((err, client, done) => {
                if (err) return reject(err)
                console.log('client?', client, err)
                if (!client) return reject(`Could not get client from pool!`)
                console.log('client?', client)
                client.query(query, params, function (err, result) {
                    done()//call `done()` to release the client back to the pool
                    if (err) {
                        console.error(
                            `PGQuery.query - error running query\n` +
                            `         query: ${query}\n` +
                            `        params: ${JSON.stringify(params)}\n` +
                            `         error: `,
                            err
                        )

                    }
                    return (err) ? reject(err) : resolve(result)
                })
            })
        }))
    }

    async exec({query, params}) {
        return (await this.query({query, params})).rows
    }

    async execOne({query, params}) {
        return (await this.query({query, params})).rows[0]
    }

    shutdown() {
        this.pool.end()
    }
}

const _db = new DB()

module.exports = _db