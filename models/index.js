import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

Precio.hasOne(Propiedad) // Se lee de derecha hacia izquierda
// Propiedad.belongsTo(Precio, {foreignKey: 'Nombre'}) es lo mismo pero más claro

Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}