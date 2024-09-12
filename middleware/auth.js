//Ce Middleware d'authentification permet de sécuriser les routes du notre API

//Import de jsonwebtoken
const jwt = require('jsonwebtoken'); 

//Utilisation de ce variable d'environnement pour la clé du token
//const tokenKey = process.env.TOKEN_PRIVATE_KEY; 


//Export de cette function etant notre middleware
module.exports = (req, res, next) => {
    try {

        //Récuperation du token(envoyer par le client): 
        //On divise le string en un tableau autour d'espace entre Bearer et le token[1]qu'on récupère 
        const token = req.headers.authorization.split(' ')[1]; 

        //Décoder le token récupèré via la méthode Verify(Vérifie UserID)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        
        //Récupère la propriété userID du Token décoder
        const userId = decodedToken.userId;
        //Rajouter la valeur de ce userID à l'objet Request qui permettra aux différentes routes de l'utiliser 
        req.auth = {

            //Création de l'objet auth avec un champ userId
            userId: userId 
        };   

     //Requête authentifiée, on passe à l'éxecution ou(au Middleware suivant)
     next();  

    } catch(error) {
        //En cas de probléme, nous enverrons l'erreur 401
        res.status(401).json({error}); 
    }
    
};   