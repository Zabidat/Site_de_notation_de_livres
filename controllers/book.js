//Ce fichier stocke la Logique Métiers ou les opérations appliquées à chaque routes de notre appplication

//Import du Schema ou modèle crée (le modèle book que j'ai crée au base de données)
const Book = require('../models/book'); 

//Import the filesystem module(Module de Systeme de Fichier) de Node.js: intéragir avec le système de fichiers du serveur
const fs = require('fs'); 


//Méthode POST: Export cette fonction pour créer ou Enregistrer un livre
exports.addBook = (req, res, next) => {

  //Transformer l'objet ou chaîne JSON réçu par le Front-end en Form-DATA(Objet Javascript) 
  const bookObject = JSON.parse(req.body.book);

  //L'objet bookObject regarde Si id de l'Utilisateur du book est égal de l'id du requête ou du user connecté
  bookObject.userId = req.auth.userId;

  //On construit l'URL complète du fichier enregistré
  bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const book = new Book({

      ...bookObject

  });

  //Enregistrer book au Base de données, avec la méthode save qui envoie une promise
  book.save() 
    
  //La méthode then envoi une réponse de Réussite au front-end que le Livre est crée dans la Base de donnée
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))

  //Si une erreur se produit,On envoie l'erreur 400,avec l'erreur générée 
  .catch(error =>{console.log(error);res.status(400).json({ error })});

};


//Méthode GET: Récupérer tous les livres dans la base de données
exports.getAllBooks = (req,res,next) => {
  
  //La méthode find sans condition nous retourne un tableau contenant les données Book de la base de données
  Book.find()

  //La méthode then envoi une réponse de Réussite au front-end
  .then(books => res.status(200).json(books))

  //Si une erreur se produit,On envoie l'erreur 400,avec l'erreur générée 
  .catch(error => res.status(400).json({ error }));  

};


//Méthode GET: Récupérez un seul objet(ou livre)dans la base de donnée avec l'_id fourni
exports.getOneBook = (req, res, next) => {
  
  //findOne va trouver le Book unique ayant le même _id que l'argument de la requête
  Book.findOne({ _id: req.params.id }) 

  //Envoi du Book(retourne dans une Promise) au Front-end 
  .then(book => res.status(200).json(book))

  //Si le LIVRE N'est pas trouvé ou Si une erreur se produit, On envoie erreur 404 au FRont-end, avec l'erreur générée
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

    //Notre Objet bookObject regarde Si l'image ou fichier est trouvé, On transforme LE BODY JSON en FORM-DATA(Objet Javascript) se trouvant dans req.body.book
    ...JSON.parse(req.body.book),
    //Ensuite reconstruire l'URL complète de l'Image enregistré avec req.protocole; .get('host'),etc
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`


  } :
  {
    //Si le fichier n'est pas trouvé,...req.body= récupère tous les propriétés de l'objet avec leur valeurs
    ...req.body 
  }; 

  //findOne va rechercher id unique ayant le même _id que l'argument de la requête dans mon mondel Book
  Book.findOne({_id:req.params.id})

  //Envoi du Book retourné dans une promise
  .then((book) => {

    //Si id de l'Utilisateur du book est différent de l'id du requête ou du user connecté
    if (book.userId !== req.auth.userId) {
      
      //On envoie ce message d'erreur
      res.status(401).json({message: 'Not authorized'});
    } 
    else { 

      //split va diviser le chemin d'image, pour nous renvoyé l'image elle même qui correspond au 2ème élément
      const filename = book.imageUrl.split('/images/')[1];
      if(req.file )
      {
        //Si on envoi un fichier Image, alors 
        //Méthode unlink du fs de Node.js supprime,l'image dans le fichier Images
        fs.unlink(`images/${filename}`, () => {

        Book.findOneAndUpdate({ _id: req.params.id },bookObject)

          //La méthode then envoi une réponse de Réussite au front-end que le Livre est modifié dans la Base de donnée
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))

          //Si le Méthode unlink du fs échoue on génère l'erreur 400
          .catch(error => res.status(400).json({ error }));
       }); 

      }
      else
      {
        //Si on modifie les autres parametres sauf Image
        Book.findOneAndUpdate({ _id: req.params.id },bookObject)

          //La méthode then envoi une réponse de Réussite au front-end que le Livre est modifié dans la Base de donnée
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))

          //Si le Méthode unlink du fs échoue on génère l'erreur 400
          .catch(error => res.status(400).json({ error }));
      }
    }

  })

  .catch((error) => {

    //En cas d'erreur(où si la base de donnée ne fonctionne pas), on envoie l'erreur 400 au Front-end
    res.status(400).json({ error });
  }); 

}; 


// Méthode Delete pour Supprimer un objet(un livre) avec l'_id Fourni et l'image Correspondante
exports.deleteBook = (req, res, next) => {

 //findOne va trouver le Book unique ayant le même _id que l'argument de la requête 
  Book.findOne({_id: req.params.id})
    .then((book) => {

      //Si id de l'Utilisateur qui a cree le book est différent de l'id du requête ou du user connecté : il ne peut pas supprimer le livre 
      if (book.userId !== req.auth.userId)
      {
        res.status(401).json({message: 'Not authorized'}); 
      }
      else {

         //Split va diviser le nom d'image, pour nous renvoyé l'image elle même qui correspond au 2ème élément
          const filename = book.imageUrl.split('/images/')[1]; 

          //Méthode unlink du fs de Node.js supprime l'image dans le fichier Images 
          fs.unlink(`images/${filename}`, () => {

            //DeleteOne supprime le Livre dont _id de comparaison est égal à l'id des paramètre de Route
            Book.deleteOne({_id: req. params.id})

            //La méthode then envoi une réponse de Réussite au front-end que le Livre est supprimé dans la Base de donnée
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))

            //On envoie une réponse d'échen au front-end
            .catch(error => res.status(401).json({ error }));

          }); 
      }

    })
    .catch((error) => {

      //Si une erreur se produit(où si la base de donnée ne fonctionne pas),on envoie l'erreur 400
      res.status(500).json({ error });
  });

};


//Méthode Post, Cette Route Post prend en argument id fourni : Ajouter ou définir la Note(Rating)d'un Livre et le ReCalculé la Note Moyenne(averageRating)
exports.addRating = (req, res, next) => {

  //findOne va trouver le Book dont l'id correspond à l'id du requête (ayant le même _id que l'argument de la requête) 
  Book.findOne({_id: req.params.id})

    .then((book) => {

      //la méthode some vérifie la condition à l'intérieur du tableau Rating: 
      //User qui veut noter existe déjà dans le tableau Rating = True, on renvoie else

      if(!book.ratings.some(rating => rating.userId === req.body.userId)) {

        //User n'existe pas dans le tableau Rating du BD(book),Push ajoute id du User et sa note dans le tableau Ratings
        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating}); 
        console.log(book.ratings);

         //ParseFloat Retourne 1 nombre réel, 
        //Reduce fait la somme du toutes les grades(notes) et Divise par la taille du tableau(Nbr d'User qui ont notè), ET ON fixe 1 chiffre après la virgule
        book.averageRating = parseFloat((book.ratings.reduce((a,b) => a + b.grade, 0)) / (book.ratings.length)).toFixed(1); 
       console.log(book.averageRating); 


        //FindOneAndUpdate va trouver le Livre dont l'_id EST le même que l'id de la requête et le mettre à jour
          Book.findOneAndUpdate({ _id: req.params.id}, book,{new:true})

          .then((updated) => {res.status(200).json(updated)})
          .catch(error => res.status(400).json({ error})); 

      }
      else {

        res.status(401).json({message: 'Vous avez déjà publié une note !'}); 
      }

    })

    //Si une erreur se produit(où si la base de donnée ne fonctionne pas)
    .catch(error => res.status(400).json({ error})); 

}; 

