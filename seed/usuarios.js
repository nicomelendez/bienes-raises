import bcrypt from 'bcrypt'

const usuarios = [
    {
    nombre: 'Nicolas',
    email: 'nicolas@nicolas.com',
    confirm: 1,
    password: bcrypt.hashSync('password',10)
}
]

export default usuarios