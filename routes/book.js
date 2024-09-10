//Ce Fichier contient la création des Routes pour la partie book de l'application

const express = require('express');
//Créer une Méthode Router d'express(pour chaque route principale de notre application)
const router = express.Router();
//Import du middleware auth pour sécuriser les Routes(on le met avant nos gestionnaire de routes pour qu'il utilise le travail de auth)
//const auth = require('../middleware/auth');

//Import du controllers book 
const bookCtrl = require('../controllers/book');


//Cette Route répondra qu'au requte POST: Création API POST (recevoir les datas de la part du frontend)
router.post('/', bookCtrl.addBook); 
  
//Création API GET ou Middleware des requêtes GET pour récupérer tous les objets au Base de données, avec l'image téléchargée
router.get('/', bookCtrl.getAllBooks); 

//('/:id= Cette Route a un parametre id) Récupérez un seul objet(ou élément)dans la base de donnée 
router.get('/:id' , bookCtrl.getOneBook); 

//Cette Route GET Récupère un Tableau de 3 Livres dans Base Data ayant la meilleure note moyenne dans la collection des livres
router.get('/', bookCtrl.getBestRatedBooks); 

//Cette Route PUT Modifie ou met à jour les données Book de l'_id fourni et Image téléchargée
router.put('/:id' , bookCtrl.updateBook); 

//Cette Route DELETE pour supprimer un objet avec id fourni et image associée


//Exporter le router de ce fichier 
module.exports = router; 