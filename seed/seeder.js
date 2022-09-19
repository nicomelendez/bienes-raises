import {exit} from 'node:process'
import precios from './precios.js';
import Precio from '../models/Precio.js'
import categorias from "./categorias.js";
import Categoria from '../models/Categoria.js'
import db from '../config/db.js'

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
    try{
        await Promise.all([
            Categoria.destroy({where:{},truncate:true}),
            Precio.destroy({where:{}, truncate:true})
        ])

        // await db.sync({force:true}) Elimina las todo y las tablas 
        console.log('Datos eliminados correctamente')
        exit()
    }catch(error){
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