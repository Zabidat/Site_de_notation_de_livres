//Ce fichier stocke la Logique Métiers ou les opérations appliquées à chaque routes de notre appplication

//Import du Schema ou modèle crée (le modèle book que j'ai crée au base de données)
const Book = require('../models/book'); 
//Import the filesystem module(Module de Systeme de Fichier) de Node.js
const fs = require('fs'); 


//Méthode POST: Export cette fonction pour créer ou Enregistrer un livre
exports.addBook = (req, res, next) => {

    //Transformer l'objet réçu par le Front-end en JSON
    const bookObject = JSON.parse(req.body.book);
    bookObject.userId = req.auth.userId;
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const book = new Book({

      ...bookObject

    });

    //Enregistrer book au Base de données
    book.save()  
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error =>{console.log(error);res.status(400).json({ error })});
};

//Méthode GET: Récupérer tous les livres dans la base de données
exports.getAllBooks = (req,res,next) => {
  
    //La méthode find sans condition nous retourne un tableau contenant les données Book de la base de données
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));  
};

//Méthode GET: Récupérez un seul objet(ou livre)dans la base de donnée avec l'_id fourni
exports.getOneBook = (req, res, next) => {
  
  //findOne va trouver le Book unique ayant le meme _id que l'argument de la requête
  Book.findOne({ _id: req.params.id }) 
  //Envoi du Book(retourne dans une Promise) au Front-end 
  .then(book => res.status(200).json(book))
  // en cas d'erreur, on envoie erreur 404 au FRont-end
  .catch(error => res.status(404).json({ error }));
};

//Méthode GET: Récupérer Tableau de 3 Livres dans Base Data ayant la meilleure note moyenne dans la collection des livres en utlisant la fonction Mongoose
exports.getBestRatedBooks = (req, res, next) => {

  //Sur mon Modèle Book Find() de MongoDB va retouner tous les éléments du tableau
  Book.find()

  //Méthode JS sort va trier le tableau en fonction du params AverageRating, par ordre décroissant(-1),
  //Average ou moyenne(est le nom du collection), et . limit nous renvoie un tableau de 3 premiers éléments mieux notés
  .sort({averageRating: -1})
  .limit(3)
  .then(books => res.status(200).json(books)) 
  .catch(error => res.status(400).json({error}));  
};

//Méthode PUT: Modifier un livre avec l'_id fourni
exports.updateBook = (req, res, next) => {

  const bookObject = req.file ? {
    //Si l'image est trouvé, On transformE LE BODY en JSON se trouve dans req.body.book
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}: //${req.get('host')}/${req.file.path}`
  } :
  {
    //Si le fichier n'est pas trouvé,...req.body= récupère tous les propriétés de l'objet avec leur valeurs
    ...req.body 
  }; 

  //findOne va rechercher id du req unique ayant le meme _id que l'argument de la requête dans mon mondel Book
  Book.findOne({_id:req.params.id})
  //Envoi du Book retourné dans une promise
  .then((book) => {

    //Si id de User book est différent de l'id du requête ou du user connecté
    if (book.userId !== req.auth.userId) {
      
      //On envoie ce message d'erreur
      res.status(401).json({message: 'Not authorized'});
    } 
    else { 

      //split va diviser le chemin d'image, pour nous renvoyé l'image elle meme qui correspond au 2eme elt
      const filename = book.imageUrl.split('/images/')[1];

        //Méthode fs.unlink de Node.js supprime, Le nom de l'image dans le fichier Images
        fs.unlink(`images/${filename}`, () => {

          Book.findOneAndUpdate({ _id: req.params.id }, bookObject)
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          //Si le Méthode fs.unlink échoue on génère l'erreur 400
          .catch(error => res.status(400).json({ error }));
       }); 
    }

  })

  .catch((error) => {
    //En cas d erreur, on envoie l'erreur 404 au Front-end
    res.status(400).json({ error });
  }); 

}; 

// Méthode Delete pour Supprimer un objet(un livre) avec l'_id fourni et l'image correspondante

