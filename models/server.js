const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server{
  constructor(){
    this.app = express()
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
  }

  listen(){
    this.app.use('/api', this.routes)
  }

}

module.exports = Server