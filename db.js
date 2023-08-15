const Pool = require('pg').Pool
require('dotenv').config()

const devConfig = {
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_DBPORT,
    database: process.env.PG_DB
}
// const pool = new Pool(devConfig)

//vercel
const pool = new Pool({

    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  
  })

pool.connect((err) => {
    if (err) throw err
    console.log('connected to postgreSQL successfully')
})

module.exports = pool;