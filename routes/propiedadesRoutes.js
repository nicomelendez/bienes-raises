import express from 'express';
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)

router.get('/propiedades/crear',protegerRuta, crear)
router.post('/propiedades/crear',protegerRuta,  
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción no puede ir vacia')
        .isLength({max:200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Seleccione una categoría'),
    body('precio').isNumeric().withMessage('Seleccione un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Seleccione la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccione la cantidad de estacionamientos'),
    body('banios').isNumeric().withMessage('Seleccione la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)

export default router