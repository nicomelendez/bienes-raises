import {check, validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"

const formularioLogin =  (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro =  (req,res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
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
            pagina: 'Error',
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
            errores: [{msg:'El usuario ya existe'}],
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email
            }
        })
    }
    return;
    // const usuario = await Usuario.create(req.body);
    // res.json(usuario);
}



const formularioOlvidePassword =  (req,res) => {
    res.render('auth/recuperar-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}