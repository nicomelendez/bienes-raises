import {check, validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/token.js'
import {emailRegistro} from '../helpers/emails.js'

const formularioLogin =  (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro =  (req,res) => {

    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken:req.csrfToken()
    })
}

const registrar = async (req, res)=>{

    const {nombre, email, password} = req.body
    //Validacion    
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    await check('password').isLength({min:6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(password).withMessage('Las contraseña no son iguales').run(req)

    let resultado = validationResult(req)
    //verificar si el resulta esta vacio

    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/registro',{
            pagina: 'Crear cuenta',
            csrfToken:req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre:nombre,
                email:email
            }
        })
    }

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where: {email:email}} )

    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Error',
            csrfToken:req.csrfToken(),
            errores: [{msg:'El usuario ya existe'}],
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email
            }
        })
    }
    
    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de confirmacion
    emailRegistro({
        nombre:usuario.nombre,
        email:usuario.email,
        token:usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
        pagina:'Cuenta creada correctamente',
            mensaje:`¡Gracias por unirte ${usuario.nombre}!. Hemos enviado un e-mail de confirmación, porfavor confirma desde tu mail.`,

    })
}

//Función para confirmar una cuenta
const confirmar = async(req,res) => {

    const {token} = req.params;
    
    //Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error:true
        })
    }
    
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    return res.render('auth/confirmarCuenta',{
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
    })
}


//Crear la funcion para recuperar la contraseña
const formularioOlvidePassword =  (req,res) => {
    res.render('auth/recuperar-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    confirmar,
    registrar
}