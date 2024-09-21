//Ce controller contient les Opérations lofiques de 2 API d'authentification 

//Import du package de cryptage pour les mots de passe permet de sécuriser les MP
const bcrypt = require ('bcrypt'); 
//Import de ce package pour créer et vérifier les tokens d'authentification (Aussi pour créer de news objets)
const jwt = require('jsonwebtoken');  

//Import de notre modele User(créer dans la Base de donnée) car on va lire et enregistrer dans ces middlewares
const User = require('../models/User');


//API Signup pour la création de nouveaux utilisateurs dans la base de donnée
exports.signup = (req, res, next) => {

    //Hashée ou crytpée le mot de passe dans la BD(étant une function asynchrone)
    //1er argument du hash prend le mot de passe du coprs du requête FRont-end, et le salt(10)= nombre de fois où on éxecute le hashage pour sécuriser le password
    bcrypt.hash(req.body.password, 10)


    //Cette fonction asynchrone nous renvoie une promise avec le hah généré
    //On récupère le hash et on l'enregistre dans la base de donnée(dans un new user)
    .then(hash => {

        const user = new User({

            //user stocke l'email et password avec leurs valeurs
            //On passe l'email fournie par le corps du requête
            email: req.body.email,
            //On enregistre le hash crée en haut(then(hash=mot de passe cryptée)
            password: hash 
        });

        //Enregistrement de USER dans la base de donnée
        user.save()

        //On envoie un 201 pour la création d'une ressource et un message
        .then(() =>  res.status(201).json({message: 'Utilisateur crée'}))
        .catch(error => res.status(500).json({error})); 

    }) 

    //En cas d'erreur d'éxecution de la requête au serveur 
    .catch(error => res.status(500).json({error})); 

};


//API Login permet aux utlisateurs existants de se connecter
exports.login = (req, res, next) => {

    //Vérifie si email saisi par User correspond à un email dans la BD 
    User.findOne({email: req.body.email})

    .then(user => {

        //On récupère la valeur trouvé par notre requête et on vérifie si elle est égale à null
        if(user === null) {

            //Si l'utilisateur n'existe pas dans la BD, on renvoie une erreur 401 avec un message
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'}); 
        }
        else {

            //Si on a trouvé une valeur(user est enregistré dans la Base de Donnée)
            //On compare le mot de passe transmit par le client avec le mot de passe ou hash du Base de Donnée 
            bcrypt.compare(req.body.password, user.password)
            .then( valid => {
                if(!valid){

                    //Si le mot de passe ne corresponde pas(valeur false) alors c'est une erreur d'authentification
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'}); 
                }
                else {

                    //si le mot de passe est correct, valide ou correspond
                    //On retourne une réponse 200 avec un objet content user_id et TOKEN 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {
                                //La méthode sign du jsonwebtoken pour encoder un new TOKEN qui Contient l'ID d'utilisateur,
                                //Comme un payload personnalisé(les données encodées à l'intérieur de ce token)ou pour la création des news objet
                                userId: user._id

                            },
                            //Une Clé secrète pour Sécuriser, Chiffrer ou Déchiffrer le token(l'encodage)
                            'RANDOM_TOKEN_SECRET',
                            //Définir une durée d'expiration du token (Arrivé au bout de 72h user devra se reconnecter)
                            { expiresIn: '72H'}
                        )

                    }); 
                }
            })
            .catch(error => {
                res.status(500).json({error}); 
            })
        }
    })

    .catch(error => {
        //En cas d'erreur d'éxecution de la requête au serveur
        res.status(500).json({error}); 
    }); 


};