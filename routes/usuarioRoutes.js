import express from 'express';

const router = express.Router();

router.get('/', function(req,res) {
    res.json({
        nombre:"Nicolas",
        apellido:"Melendez"
    })
});

router.get('/nosotros', function(req,res) {
    res.send('Somos una empresa')
});

export default router