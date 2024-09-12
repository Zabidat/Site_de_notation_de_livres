// Création de l'application Express via Ce Fichier

//Import d'Express
const express = require('express');  
//Création de l'application Express
const app = express(); 
//Import de ce Package pour accéder au path de notre serveur(gérer les requêtes vers la route/image)
const path = require('path');
//Import du Routeur book 
const bookRoutes = require('./routes/book'); 
//Import du Router User dans l'application express
const userRoutes = require('./routes/user'); 


//La fonction use permet à Express d'accepter toutes les requêtes (Post or update) type-content:json
app.use(express.json()); 
//Pour gérer les Form-Data pour les données codées en URL envoyer au Back-end
app.use(express.urlencoded({ extended: true }))


//Erreurs de CORS: Permet au server de laisser passer toutes les requêtes comme POST,GET,ECT
//C'est un Middleware générale,Car on a pas mis une route Spécifique(il sera appliquer à toute les routes)
app.use((req, res, next) => {

    //Acceder à n'importe quelle origin
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    //On autorise certains en-tetes sur l'objet requête                
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');  
    //On autorise Certaines methodes , comme les verbes get, post,etc;   
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  
    //Next pour passer l'éxecution au middleware d'apres 
    console.log(req.body);
    next();
    
});


//Ce Gestionnaire de Routage indique à Express de gérer la ressource images de façon statique À chaque requête vers la route/images(ayant un sous répertoire_dirname)
app.use('/images', express.static(path.join(__dirname, 'images')));

//Enregistrez le Router Principal du BOOK pour éffectuer toutes les demandes effectuées par bookRoutes
app.use('/api/books', bookRoutes);
//Enregistrer le router Principal du User: La route attendue par le front-end(/api/auth) et la route racine liées à l'authentification 
app.use('/api/auth', userRoutes); 


//Exporter cette application permet d'utiliser notre app Express à l'extérieur(y accéder depuis les autres fichiers de notre projet)
module.exports = app; 

