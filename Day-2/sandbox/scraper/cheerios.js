const fs = require('fs');
const cheerio = require('cheerio');

// Fonction pour récupérer et parser le tableau
async function recupererTableau() {
    try {
        const $ = await cheerio.fromURL("https://www.footmercato.net/europe/ligue-des-champions-uefa/classement");
        
        // Sélectionner le tableau avec le sélecteur passé en paramètre
        const tableau = $("table");
        
        // **Partie 1 Modifiée: Récupération des en-têtes**
        const headers = $(tableau).find('thead tr th').map((i, el) => $(el).text().trim()).get();

        //Si aucun en-tête n'est trouvé, utiliser les premières cellules de la première ligne
        if (headers.length === 0) {
            const firstRowCells = $(tableau).find('tr:first-child td, tr:first-child th');
            for (let i = 0; i < firstRowCells.length; i++) {
                headers.push($(firstRowCells[i]).text().trim());
            }
        }
        
        // **Partie 2 Modifiée: Parcours des lignes et récupération des données**
        let lignes = [];
        //let rows = $(tableau).find('tbody tr'); // Removed this line

        //Si aucune balise <tbody>, on récupère tous les <tr> à partir de la deuxième ligne
        let rows = $(tableau).find('tbody tr');
        if (rows.length === 0) {
            rows = $(tableau).find('tr:not(:first-child)');
        }

        rows.each((i, element) => {
            let ligne = {};
            $(element).find('td').each((j, cell) => {
                const key = headers[j] || 'col' + (j + 1);
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
