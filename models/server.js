const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server{
  constructor(){
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      // uploads: '/api/uploads',
      index: '/api',
    }

    // Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Rutas
    this.routes()
  }

  async conectarDB(){
    await dbConnection()
  }

  middlewares(){
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  routes(){
    this.app.use(this.paths.index, require('../routes/index'))
    // this.app.use(this.paths.uploads, require('../routes/uploads'))
  }

  listen(){
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en localhost:${this.port}`)
    })
  }

}

module.exports = Server