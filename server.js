require('dotenv').config()
const PORT = process.env.REACT_APP_PORT || 5000;
const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const Auth = require('./routes/Auth.js')
const ToDo = require('./routes/To-dos')
app.use(cors({
    origin: 'https://client-8yr1ffaha-a-foxx.vercel.app/', // Replace with your frontend domain
    credentials: true,
}));

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'To-do API',
        version: '1.0.0',
        description: 'API documentation for the To-do application',
    },
    host: 'localhost:8000',
    basePath: '/',
    components: {
        schemas: {
            User: {
                type: 'object',
                required: ['email', 'hashed_password'],
                properties: {
                    email: {
                        type: 'string',
                        description: "user's email address PUBLIC KEY",
                    },
                    hashed_password: {
                        type: 'string',
                        description: "user's hashed password",
                    },
                },
            },
            Todos: {
                type: 'object',
                required: ['id', 'user_email', 'title', 'progress', 'date'],
                properties: {
                    id: {
                        type: 'uuid',
                        description: 'id for each to-do entry'
                    },
                    user_email: {
                        type: 'string',
                        description: 'email of user associated with to-do entry'
                    },
                    title: {
                        type: 'string',
                        description: 'the title of the to-do'
                    },
                    progress: {
                        type: 'integer',
                        description: 'value of progress meter for to-do entry'
                    },
                    date: {
                        type: 'string',
                        description: 'date of to-do entry'
                    }
                }
            }
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json())

// if(process.env.NODE_ENV === "production") {
//     // server static content
//     app.use(express.static(path.join(_dirname, 'client/build')))
// }

app.use('/to-do', ToDo)
app.use('/auth', Auth)

console.log('working')

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

module.exports = app