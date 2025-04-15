const fs = require('fs');
const cheerio = require('cheerio');

// Fonction pour récupérer et parser le tableau
async function recupererTableau() {
    try {
        const $ = await cheerio.fromURL("https://www.footmercato.net/europe/ligue-des-champions-uefa/classement");
        
        // Sélectionner le tableau
        const tableau = $("table");
        
        // Parcourir les lignes du tableau pour récupérer les données
        let lignes = [];
        tableau.find('tbody tr').each((i, row) => { // Sélectionne directement les lignes du corps du tableau
            let ligne = {};
            $(row).find('td').each((j, cell) => { // Pour chaque cellule <td> de la ligne
                const key = `col${j + 1}`; // Nom de colonne par défaut
                ligne[key] = $(cell).text().trim();
            });
            lignes.push(ligne);
        });
        
        // Sauvegarder les données dans un fichier JSON
        await sauvegarderDonnees(lignes);
        
        return lignes;
    } catch (error) {
        console.error("Erreur lors de la récupération du tableau :", error);
        return [];
    }
}

// Fonction pour sauvegarder les données dans un fichier JSON
async function sauvegarderDonnees(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('sauvegarde.json', jsonData);
        console.log('Données sauvegardées avec succès dans sauvegarde.json');
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données :", error);
    }
}

// Appeler la fonction principale
recupererTableau();
