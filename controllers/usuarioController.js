import {check, validationResult} from 'express-validator'

import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import {generarJWT, generarId } from '../helpers/token.js'
import {emailRegistro,emailOlvidePassword} from '../helpers/emails.js'

const formularioLogin =  (req,res) => {

        res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken()
            })
            
}

const formularioRegistro =  (req,res) => {

    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken:req.csrfToken()
    })
}

const autenticar = async(req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatorio').run(req)

    let resultado = validationResult(req)
    //verificar si el resulta esta vacio

    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Comprobar si el usuario existe
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El usuario no existe'}],
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'Tu cuenta no ha sido confirmada, revisa tu mail'}],
        })
    }

    //Verificar si la contraseña es correcta 
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'La contraseña es incorrecta'}],
        })
    }
    
    const {id, nombre} = usuario;
    //Autenticar un usuario
   const token = generarJWT({id: id, nombre:nombre});

   //Almacenar en un cookie

   return res.cookie('_token', token, {
        httpOnly: true, //para que no nos roben datos desde la consola

       /* secure: true, // para el ssl
        sameSite:true // para el ssl */
   }).redirect('/mis-propiedades')

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



const formularioOlvidePassword =  (req,res) => {
    res.render('auth/recuperar-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res)=> {

    const {email,} = req.body
    //Validacion    
    await check('email').isEmail().withMessage('El email no es valido').run(req)

    let resultado = validationResult(req)

    //verificar si el resulta esta vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/recuperar-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar el usuario
    const usuario = await Usuario.findOne({ where:{email} });

    if(!usuario || usuario === null){
        return res.render('auth/recuperar-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg:'Error, el email no pertence a ningún usuario'}]
        })
    }

    //Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    // Enviar un email
    emailOlvidePassword({
        email:usuario.email,
        nombre:usuario.nombre,
        token:usuario.token
    })

    //Renderizar un mensaje para que cambie la contraseña
    res.render('templates/mensaje',
    {
        pagina:'Reestablece tu contraseña',
        mensaje:'Hemos enviado un mail con las instrucciones',
        csrfToken: req.csrfToken()
    })
}

const comprobarToken = async (req,res) => {

    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}});

    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            pagina: 'Reestablece tu contraseña',
            mensaje: 'Hubo un errror al validar tu información, vuelve a intentar',
            error: true,
        })
    }

    //Mostrar formulario para modificar la contraseña
    res.render('auth/reset-password',{
        pagina:'Reestablece tu contraseña',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req,res)=>{

    const {password} = req.body
    //Validar el password
    await check('password').isLength({min:6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(password).withMessage('Las contraseña no son iguales').run(req)

    let resultado = validationResult(req)
    //verificar si el resulta esta vacio

    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/reset-password',{
            pagina: 'Reestablecer tu contraseña',
            csrfToken:req.csrfToken(),
            errores: [{msg:'Las contraseñas deben ser iguales y de 6 caracteres o más'}]
        })
    }

    const {token} = req.params;
    
    //Identificar quien hace el cambibo
    const usuario = await Usuario.findOne({where:{token}})
    
    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmarCuenta',{
        pagina:'Contraseña reestablecida',
        mensaje: 'La contraseña se ha reestablecido correctamente',
        csrfToken: req.csrfToken()
    })
}   

export {
    formularioLogin,
    formularioRegistro,
    autenticar,
    formularioOlvidePassword,
    confirmar,
    registrar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}