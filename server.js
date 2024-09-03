//Configuration du serveur Node.js (il va attendre des requête http et répondra)

//Import du package http de Node (permet de creer un server)
const http = require('http');
//Import de notre app Express
const app = require('./app'); 
//import du package mongoose(facilite l'intéraction entre mon app Epress et mon Base de données MongoDB)
const mongoose = require('mongoose'); 


//Logique pour la Connexion de mon API à ma base de donnée à distante ou MongoDB 
mongoose.connect('mongodb+srv://zabidatprojet6:Monprojet6@cluster0.ql2wp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
{ useNewUrlParser: true,
  useUnifiedTopology: true }) 
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//Cette Fonction renvoie un port valide et prend en argument val. Elle a comme objectif
//de transformer le port en entier(parseInt(val, 10 = base de 10 ne doit pas avoir virgule))
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        //val= numero du port qu on va rentrer 
        //Si le port envoyé est sous la forme d'une chaîne, NaN est renvoyé
        return val;     
    }

    if (port >= 0) {
        return port; 
    }

    return false; 
};

const port = normalizePort (process.env.PORT || 4000); 
//app Express va initialser le PORT:
//Soit par la variable d'environnement ou Soit par défaut le port 4000
app.set('port', port); 


// Cette Fonction gére la gestion d'erreur du serveur
const errorHandler = error => {

    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;

    switch (error.code) {
        case 'EACCES':
            //Message affiche, si l'adresse est protege, on demandera 1 droit d'acces
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;

        case 'EADDRINUSE' :
            //Message affiche, Si le server est deja utlise 
            console.error(bind + ' is already in use.'); 
            process.exit(1);
            break; 
        
        default: 
         // si l'erreur d'adress n'est ni case 1, ni 2 alors on execute default
         throw error; 
    }
}; 


//On passe app Express au serveur; app reçevra les requêtes et les réponses
const server = http.createServer(app); 

// On enregistre la Fonction errorHandler dans le serveur
server.on('error', errorHandler);

//On enregistre un écouteur d'évènements,enregistrant le port auquel le serveur s'éxecute dans la conseole
server.on('listening', () => {

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port ' + port; 

    console.log('Listening on ' + bind);
}); 

server.listen(port); 


