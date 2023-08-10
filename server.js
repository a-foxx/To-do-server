const PORT = process.env.POSTGRES_PORT || 8000
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const Auth = require('./routes/Auth.js')
const ToDo = require('./routes/To-dos')

const swaggerDefinition = {
    info: {
      title: 'To-do Swagger API',
      version: '1.0.0',
      description: 'Endpoints to test',
    },
    host: 'localhost:8000',
    basePath: '/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  };
  
  const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
  };

const specs = swaggerJsDoc(options)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use(cors());
app.use(express.json())

// if(process.env.NODE_ENV === "production") {
//     // server static content
//     app.use(express.static(path.join(_dirname, 'client/build')))
// }

app.use('/to-do', ToDo)
app.use('/auth', Auth)

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

module.exports = app