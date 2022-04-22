const express = require('express')
const cors = require('cors')
const multer = require('multer')
const logger = require('./logger.js')
const {start} = require('./service.js')

const app = express()
const APP_PORT = 8080
const IMG_UPLOAD_DIR = './uploads/'
const UPLOADER = multer({ dest: IMG_UPLOAD_DIR })
const PORT = process.env.PORT || APP_PORT;

app.use(express.static('public')) // Static files
app.use(express.json()) // Body Parser. Useful for POST requests.
app.use(cors())
app.use(UPLOADER.single('image'))

start(app, IMG_UPLOAD_DIR) // Start Services
app.listen(PORT, _ => console.log(`Listening on ${PORT}`)) // Accept client requests