//Création d'un table ou Schema de données dans notre base de données : gére les informationS du LIVRE 

//Import de mongoose
const mongoose = require('mongoose');

//Création du schema de donnée OU ARCHITECTURE DES COLONNES (1 objet qui présente les différents champs que notre schéma a besoin)
const bookSchema = mongoose.Schema({

    //La méthode Schema de Mongoose crée notre modèle de données et prend les propriétés ci-dessous
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: false },
    imageUrl: { type: String, required: false },
    year: { type: Number, required: false }, 
    genre: { type: String, required: false },  
    ratings:[
        {
            userId: { type: String, required: false },
            grade: { type: Number, required: false }
        }
    ],
    averageRating: { type: Number, required: false} 
}); 


//Exportons ce Schema étant un modèle Mongoose appelé Book(name modèle) avec thingSchema(Schema crée)
//La méthode model transforme ce modèle en un modèle utilisanle 
module.exports = mongoose.model('Book' , bookSchema); 