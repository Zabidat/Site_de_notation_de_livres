//Ce fichier user c'est pour créer un router pour signup et login 

//Utilisation d'express pour créer un router
const express = require('express');
const router = express.Router();

// Import du controller pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user'); 


//Création de 2 routes POST envoyé par le FRONT-END:

// Cette Route permet la création de news User dans la BD
router.post('/signup', userCtrl.signup);

// Cette route permet aux USERS existant de se connecter ou s authentifier
router.post('/login', userCtrl.login); 



//Exportation de ce router
module.exports = router;  