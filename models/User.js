//Creation du modèle User pour stocker les informations User dans la Base de donnée


//Import Mongoose pour créer mon modèle dans la base de donnée
const mongoose = require('mongoose');

//Import du package validator comme plug-in à notre Model User
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:{ type: String, required:true, unique: true},
    password: {type:String, required: true}
});

//On applique ce plugin validator à notre Schema permettant de dire à Mongoose que la propriété est unique
//En cas de doublons on envoie une erreur
userSchema.plugin(uniqueValidator); 


//Export de userSchema sous forme de model s'appelant User dont on lui passe userSchema comme Schema de donnée
//La méthode model créer notre modèle dans la base de donnée 
module.exports = mongoose.model('User', userSchema); 