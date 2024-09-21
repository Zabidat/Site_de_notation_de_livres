//Ce Fichier contient la création des Routes pour la partie book de l'application
const express = require('express');

//Import de ce Multer-config pour gérer les form-data ou fichiers entrants
const multer = require('../middleware/multer-config');

//Créer une Méthode Router d'express(pour chaque route principale de notre application)
const router = express.Router();

//Import du middleware auth pour sécuriser les Routes(on le met avant nos gestionnaire de routes pour qu'il utilise le travail de auth)
const auth = require('../middleware/auth');

//Import du controllers book 
const bookCtrl = require('../controllers/book');

//Import de ce Middleware pour compresser les images entrants en Webp: pour une moderne qualitée qui rend le site plus rapide 
const bookImg = require("../middleware/compress-images"); 


//Cette Route répondra qu'au requête POST: Création API POST qui crée un livre Dans la Base de donnée 
router.post('/',auth, multer, bookImg.compressImages, bookCtrl.addBook); 
  
//Création API GET ou Middleware des requêtes GET pour récupérer tous les objets au Base de données, avec l'image téléchargée
router.get('/', bookCtrl.getAllBooks); 

//Cette Route GET(ayant comme chemin bestrating) Récupère un Tableau de 3 Livres dans Base Data ayant la meilleure note moyenne dans la collection des livres
router.get('/bestrating', bookCtrl.getBestRatedBooks); 

//('/:id= Cette Route a un parametre id) Récupérez un seul objet(ou élément)dans la base de donnée 
router.get('/:id', bookCtrl.getOneBook); 

//Cette Route PUT Modifie ou met à jour les données Book de l'_id fourni et Image téléchargée
router.put('/:id' , auth, multer, bookImg.compressImages, bookCtrl.updateBook); 

//Cette Route DELETE pour supprimer un objet(Livre) avec id fourni et image associée
router.delete('/:id', auth, bookCtrl.deleteBook);

//Cette Route Post prend en argument id fourni: Pour Ajouter ou définir la Note(Rating)d'un Livre et le ReCalculé la Note Moyenne
router.post('/:id/rating', auth, bookCtrl.addRating);


//Exporter le router de ce fichier 
module.exports = router; 