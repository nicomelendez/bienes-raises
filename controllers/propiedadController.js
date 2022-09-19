import { validationResult } from 'express-validator'
import Precio from "../models/Precio.js"
import Categoria from "../models/Categoria.js"

const admin = (req,res) => {

    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra:true
    })

}

//Formulario para crear una propiedad
const crear = async(req,res) => {
    //Consultar Modelo de Precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra:true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
    })
}

const guardar = async(req,res) => {

    //Validacion 
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array()
        })
    }
}
export {
    admin,
    crear,
    guardar
}