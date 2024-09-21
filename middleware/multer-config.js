//Import du package Multer pour gérer le traitement de fichiers de type file conetnant des requêtes : (Form-Data qu'on télécharge ayant des images)

const multer = require('multer')

const MIME_TYPE = {

    //MIME-TYPE Génère L'extension ou le format du fichier ou d'image à stocker
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}


//STORAGE: Est l'objet de configuration de multer
//IL stocke l'etat du mutler càd indique à multer où enregistrer les fichiers entrants: Récupère l image entrant 
const storage = multer.diskStorage({

    //La Fonction DISKSTORAGE: Configure le chemin et nom d'image pour les fichiers entrants
    //Et, On stocke le chemin dans la BD, pour ne pas la remplir

	destination: function (req, file, callback) {

        //Fonction DESTINATION: Indique à multer d'enregistrer les fichiers dans le Dossier images
        //Null:Pour dire qu'il y a pas d'erreur, images: Les photos seront stockés au chemin Images de notre PC
		callback(null, './images')

	},
	filename:  (req, file, callback) => { 

        //Fonction FILENAME: Dit à multer quel nom de l'image à créer ou à génèrer, et remplace les espaces par des underscores. 

		//Split céee un Tableau et Divise le nom des photos à partir des espaces
        //Join: va joindre l'élément avec Undescore càd à la palce d'espace on met undescore
		const filename = file.originalname.split(' ').join('_').split('-').join('_')
	

        //Split: forme un tableau à partir d'un point
		const filenameArray = filename.split('.')

        //Pop: enlève le dernier élément du Tableau et on récupère le fichier sans Extension
		filenameArray.pop()
		const filenameWithoutExtention = filenameArray.join('.')

        //On récupère le type du fichier comme jpg,png,etc
			const extension = MIME_TYPE[file.mimetype]

            //On construit le nom du fichier original traité +La date d'aujourd'hui+ L'extension
		callback(null, filenameWithoutExtention +'_'  + Date.now() + '.' + extension)
	} 

}); 

//On exporte notre Middleware multer configuré, en lui passant l'Objet Storage et 
//SINGLE pour dire à multer de gérer uniquemment les fichiers images (Télécharger 1 seul Fichier unique )
module.exports = multer({storage}).single('image'); 