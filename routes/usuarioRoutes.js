import express from 'express';
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar)

router.get('/recuperar-password', formularioOlvidePassword);


export default router