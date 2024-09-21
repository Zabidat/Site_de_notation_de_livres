//Ce Middleware d'authentification permet de sécuriser les routes du notre API 
//OU protéger les API dont leurs accès demande une authorization : avant d accéder au Controllers

//Import de jsonwebtoken
const jwt = require('jsonwebtoken'); 


//Export de cette fonction etant notre middleware
module.exports = (req, res, next) => {
    try {

        //Récuperation du token(envoyer par le client): 
        //On divise le string en un tableau autour d'espace entre Bearer et le TOKEN[1]qu'on récupère 
        const token = req.headers.authorization.split(' ')[1]; 

        //Décoder le token récupèré via la méthode Verify (Vérifie si le TOKEN est correct)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        
        //Récupère la propriété userID du Token décoder (qui est id du User connecté)
        const userId = decodedToken.userId;
        
        //Rajouter la valeur de ce userID à l'objet Request qui permettra aux différentes routes de l'utiliser 
        req.auth = {

            //Création de l'objet auth avec un champ userId
            userId: userId 
        };   

     //Requête authentifiée, on passe à l'éxecution au prochain Middleware (ou Middleware suivant)
     next();  

    } catch(error) { 

        //En cas de problème, nous enverrons l'erreur 401
        res.status(401).json({error}); 
    }
    
};   