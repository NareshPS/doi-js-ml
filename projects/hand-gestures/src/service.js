const temp = require('temp')
const fs = require('fs')
const {Subject} = require('rxjs')

const expressUnit = (app, {route, method}) => {
  const s = new Subject()

  app[method](route, (req, res) => {
    s.next({req, res})
  })

  return s
}

const handleError = (err, res) => {
  res.status(500)
  .contentType("text/plain")
  .end(err.toString())
}

const start = (app, upload_dir) => {
  // expressUnit(
  //   app,
  //   {
  //     route: '/datasets/:name/:start/:end',
  //     method: 'get'
  //   }
  // )
  // .subscribe(({req, res}) => {
  //   console.info(req.url)
  //   res.json({message: 'no dataset available'})
  // })

  expressUnit(
    app,
    {
      route: '/uploadImage',
      method: 'post'
    }
  )
  .subscribe(({req, res}) => {
    try {
      const localPath = temp.path({dir: upload_dir, suffix: '.png'})

      if (req.body.image) {
        const data = req.body.image.replace(/^data:image\/\w+;base64,/, '')
  
        fs.writeFile(localPath, data, {encoding: 'base64'}, function(err){
          if (err) handleError(err, res)
  
          res.send('Image saved.')
        })
      } else {
        handleError('No image data.', res)
      }
    }
    catch(err) {
      console.error(err)
      handleError(err, res)
    }
  })
}

module.exports = {start}
