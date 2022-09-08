import express from 'express';
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword,comprobarToken,nuevoPassword} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar)

router.get('/recuperar-password', formularioOlvidePassword);
router.post('/recuperar-password', resetPassword);

//Almacena el nuevo password
router.get('/recuperar-password/:token', comprobarToken);
router.post('/recuperar-password/:token', nuevoPassword);

export default router