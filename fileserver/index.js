
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const temp = require('temp')
const fs = require('fs')
const PNG = require('pngjs').PNG

const IMG_UPLOAD_DIR = './uploads/'

const app = express()
const upload = multer({ dest: IMG_UPLOAD_DIR })

const handleError = (err, res) => {
  res.status(500)
  .contentType("text/plain")
  .end(err.toString())
}

app.use(cors())
app.use(upload.single('image'))
app.post('/uploadImage', (req, res) => {
  const localPath = temp.path({dir: IMG_UPLOAD_DIR, suffix: '.png'})

  if (req.body.image) {
    const data = req.body.image.replace(/^data:image\/\w+;base64,/, '')

    fs.writeFile(localPath, data, {encoding: 'base64'}, function(err){
      if (err) handleError(err, res)

      res.send('Image saved.')
    })
  } else {
    handleError('No image data.', res)
  }
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))