const validate = require('../validate.js');
const router = require('express').Router();
const pool = require('../db')
import { v4 as uuidv4 } from 'uuid';
// const cors = require('cors')
// app.use(cors());

const validateEmail = validate.validateEmail;
const validateToDo = validate.validateToDo;

router.get('/getTodos/:userEmail', async (req, res) => {
    const { userEmail } = req.params;

    const validationResults = validateEmail(userEmail);
    if (!validationResults.valid) {
        res.status(500).json({ message: validationResults.error });
        return;
    }
    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// create new todo
router.post('/todos', async (req, res) => {
    const {user_email, title, progress, date} = req.body
    const id = uuidv4();
    
    const validationResults = validateToDo(user_email, title);
    if (!validationResults.valid) {
        res.status(500).json({ message: validationResults.error });
        return;
    }
    // add uuid to the query
    try {
        const newTodo = await pool.query(`INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)`, 
        [id, user_email, title, progress, date], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: error
                })
            }
            res.status(200).send({
                message: 'todo added',
                data: result.rows
            })
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'An error occurred' });
    }
})

// edit todo
router.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body
    
    const validationResults = validateToDo(user_email, title);
    if (!validationResults.valid) {
        res.status(500).json({ message: validationResults.error });
        return;
    }

    try {
        const editTodo = await pool.query(`UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`, [user_email, title, progress, date, id])
        res.json(editTodo)
    } catch (error) {
        console.error(error)
    }
})

// delete a todo 
router.delete('/todos/:id' , async (req, res) => {
    const {id} = req.params
    try {
        const deleteTodo = await pool.query(`DELETE FROM todos WHERE id = $1;`, [id])
        res.json(deleteTodo)

    } catch (error) {
        console.error(error)
    }
})

module.exports = router