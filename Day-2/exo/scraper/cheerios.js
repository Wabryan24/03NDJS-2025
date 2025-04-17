const fs = require('fs');
const cheerio = require('cheerio');

async function recupererTableau() {
    try {
        const $ = await cheerio.fromURL("https://www.footmercato.net/europe/ligue-des-champions-uefa/classement");

        
        const tableau = $("table");

        
        let lignes = [];
        tableau.find('tbody tr').each((i, row) => { 
            let ligne = {};
            $(row).find('td').each((j, cell) => { 
                const key = `col${j + 1}`; 
                ligne[key] = $(cell).text().trim();
            });
            lignes.push(ligne);
        });
        

        await sauvegarderDonnees(lignes);
        
        return lignes;
    } catch (error) {
        console.error("Erreur lors de la récupération du tableau :", error);
        return [];
    }
}

async function sauvegarderDonnees(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('sauvegarde.json', jsonData);
        console.log('Données sauvegardées avec succès dans sauvegarde.json');
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données :", error);
    }
}


recupererTableau();
