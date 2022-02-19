const mongoose = require('mongoose')

const dbConnection = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }catch(err){
    console.log(err)
    throw new Error('Error en conexión con la base de datos')
  }
}

module.exports = {
  dbConnection,
}