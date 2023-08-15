const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const validate = require('../validate');
const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - hashed_password
 *       properties:
 *         email:
 *           type: string
 *           description: user's email address PUBLIC KEY 
 *         hashed_password:
 *           type: string
 *           description: user's hashed password
 */


const validateEmailAndPassword = validate.validateEmailAndPassword;

router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const validationResults = validateEmailAndPassword(email, password);
    if (!validationResults.valid) {
        res.status(500).json({ message: validationResults.error });
        return;
    }

    try {
        const signup = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`, [email, hashedPassword])
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
        res.json({ email, token })
    } catch (err) {
        if (err) {
            console.error('signup error:',err)
            res.status(500).json({ data: err.detail })
        }
    }
})

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // console.log('test req: ', req.body)

    const validationResults = validateEmailAndPassword(email, password);
    if (!validationResults.valid) {
        res.status(500).json({ message: validationResults.error });
        return;
    }

    try {
      const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      if (!users.rows.length) return res.status(500).json({ message: 'User does not exist!'})
      const success = await bcrypt.compare(password, users.rows[0].hashed_password)
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
      if (success) {
        res.json({'email': users.rows[0].email, token })
      } else {
        res.status(500).json({ message: 'Login failed!' })
      }
    } catch (err) {
        console.error(err)
    }
})

module.exports = router