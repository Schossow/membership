const {Router} = require('express')
const {check} = require('express-validator')
const bcryptjs = require('bcryptjs')

const Admin = require('../models/Admin')
const Usuario = require('../models/Usuario')

const {
  generarJWT,
  validarJWT,
  validarCampos,
} = require('../helpers')

const router = Router()

router.get('/', [
  validarJWT,
], async(req, res) => {

  try{
    const usuarios = await Usuario.find()
    return res.status(200).json(usuarios)
  }catch(err){
    return res.status(500).json({err})
  }
})

router.get('/:id', [
  validarJWT,
  check('id', 'El id no es un id valido').isMongoId(),
  validarCampos,
], async(req, res) => {

  const {id} = req.params

  try{
    const usuario = await Usuario.findById(id)
    return res.status(200).json(usuario)
  }catch(err){
    return res.status(500).json({err})
  }

})

router.post('/login', [
  check('username', 'El nombre de usuario es requerido').not().isEmpty(),
  check('password', 'La contraseña es requerida').not().isEmpty(),
  validarCampos,
], async(req, res) => {
  const {username, password} = req.body

  try{

    const admin = await Admin.findOne({username})

    if(!admin){
      return res.status(400).json({
        msg: 'Usuario y/o contraseña no son correctos1'
      })
    }

    const validPassword = bcryptjs.compareSync(password, admin.password)
    if(!validPassword){
      return res.status(400).json({
        msg: 'Usuario y/o contraseña no son correctos3'
      })
    }

    const token = await generarJWT(admin.id)
    
    res.json({
      admin,
      token,
    })
    
  }catch(err){
    console.log(err)
    return res.status(500).json({
      msg: 'Ah ocurrido un error'
    })
  }
})

router.post('/admin', [
  validarJWT,
  check('username', 'El nombre de usuario es requerido').not().isEmpty(),
  check('password', 'La contraseña es requerida').not().isEmpty(),
  validarCampos,
], async(req, res) => {
  const {username, password} = req.body

  try{
    const admin = new Admin({
      username,
      password,
    })
    const adminExist = await Admin.findOne({username})
    if(adminExist){
      return res.status(400).json({
        msg: 'El nombre de usuario ya se encuentra registrado'
      })
    }
    const salt = bcryptjs.genSaltSync()
    admin.password = bcryptjs.hashSync(password, salt)
    await admin.save()
    return res.status(201).json(admin)
  }catch(err){
    return res.status(500).json({
      err
    })
  }

})

router.post('/usuario', [
  validarJWT,
  check('name', 'El nombre es requerido').not().isEmpty(),
  check('lastName', 'El apellido es requerido').not().isEmpty(),
  check('ID', 'La identificación es requerida').not().isEmpty(),
  check('email', 'El correo es requerido').not().isEmpty(),
  check('email', 'El correo no es valido').isEmail(),
  validarCampos,
], async(req, res) => {

  const {name, lastName, ID, email, password} = req.body
  try{
    const usuario = new Usuario({
      name,
      lastName,
      ID,
      email,
    })
  
    const regexpIdentificacion = new RegExp(ID, 'i')
  
    const usuarioExist = await Usuario.findOne({
      $or: [{ID: regexpIdentificacion}, {email}],
    })
  
    if(usuarioExist){
      return res.status(400).json({
        msg: 'El usuario ya se encuentra en registrado',
        usuario: usuarioExist,
      })
    }
  
    await usuario.save()
  
    return res.status(201).json(usuario)
  }catch(err){
    return res.status(500).json({
      err
    })
  }
})

router.put('/usuario/:id', [
  validarJWT,
  check('id', 'El id no es un id valido').isMongoId(),
  validarCampos,
], async(req, res) => {
  const {id} = req.params

  try{
    const usuarioExist = await Usuario.findById(id)
  
    if(!usuarioExist){
      return res.status(400).json({
        msg: `El usuario con id ${id} no se encuentra registrado`
      })
    }
  
    const usuario = await Usuario.findByIdAndUpdate(id, {state: !usuarioExist.state}, {new: true})
  
    return res.status(200).json(usuario)
  }catch(err){
    return res.status(500).json({err})
  }

})

module.exports = router