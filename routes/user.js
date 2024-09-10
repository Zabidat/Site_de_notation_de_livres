//Ce fichier user c'est pour créer un router pour signup et login 

//Utilisation d'express pour créer un router
const express = require('express');
const router = express.Router();

// Import du controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user'); 


//Création de 2 routes POST pour l'adresse e-mail et mot de passe envoyé par le FRONT-END
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login); 



//Exportation de ce router
module.exports = router;  