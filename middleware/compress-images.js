//Le package sharp de Node Js permet de compresser les images en WebP(format d'image moderne offrant une compression superieure et rend le site plus rapide)
const sharp = require('sharp');


//Import the filesystem module(Module de Systeme de Fichier) de Node.js: intéragir avec le système de fichiers du serveur
const fs = require("fs");

 //On convertit les images entrants en WebP 
exports.compressImages = (req, res, next) => {

    if (req.file) {

        //Sharp prend en argument le chemin du requête entrant  
        sharp(req.file.path)

        //On redimmensionne limage à une hauteur de 1080px 
            .resize({height: 1080})
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile('images/' + req.file.filename + '.webp', (err, info) => {
                if (err) {

                    return res.status(400).json({ error: 'Erreur lors de la compression de l\'image.' });
                }

                //Méthode unlink du fs de Node.js supprime, Le de l'image dans le fichier Images
                fs.unlink(req.file.path, () => {

                    req.file.path = 'images/' + req.file.filename + '.webp';
                    next();
                })
            });

    } else {

        next();
    }
};