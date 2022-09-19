import {exit} from 'node:process'
import precios from './precios.js';
import categorias from "./categorias.js";
import db from '../config/db.js'
import {Categoria, Precio} from '../models/index.js'

const importarDatos = async() => {

    try {
        //Autenticar
        await db.authenticate()

        //Generar las columnas
        await db.sync()
        
        //Insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos importados correctamente')
        exit()

    } catch (error) {
       console.log("🚀 ~ file: seeder.js ~ line 9 ~ importarDatos ~ error", error)
       exit(1)
    }

}

const eliminarDatos = async() => {
    try {
        await db.sync({force: true})
        console.log('Datos Eliminados Correctamente');
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}