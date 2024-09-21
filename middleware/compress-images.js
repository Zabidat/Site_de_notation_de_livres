//Le package SHARP de Node Js permet d optimiser les images en WebP(format d'image moderne offrant une compression superieure et rend le site plus rapide)
const sharp = require('sharp');


//Import the filesystem module(Module de Systeme de Fichier) de Node.js: intéragir avec le système de fichiers du serveur
const fs = require("fs");

 //On convertit les images entrants en WebP 
exports.compressImages = (req, res, next) => {

    if (req.file) {
        console.log(req.file.filename);

        //Sharp prend en argument le chemin du requête entrant: Image envoyé par Multer
        sharp("images/"+req.file.filename)

        //On redimmensionne l'image à une hauteur de 1080px 
            .resize({height: 1080})

            //La fonction to file sauvegarde les images modifiés par Sharp dans le dossier images avec l'extension WebP qu on lui associe
            .toFile('images/' + req.file.filename.split('.')[0] + '.webp', (err, info) => {

                if (err) {
                    console.log(err); 
                    return res.status(400).json({ error: 'Erreur lors de la compression de l\'image.' });
                }

                //Méthode unlink du fs de Node.js supprime, Le fichier de l'image en elle-meme(comme jpg,png,etc) dans le Dossier images
                 fs.unlink('images/'+req.file.filename, () => {

                    if(err) return console.log(err);
                 })

                //On  affecte le nouveau nom modifie par sharp
                req.file.filename = req.file.filename.split('.')[0] + '.webp'; 
                next();
               
            });

           

    } else {

        next();
    }
};