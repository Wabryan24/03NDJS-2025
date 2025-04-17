const fs = require('fs');
const cheerio = require('cheerio');

async function recupererTableau() {
    try {
        const $ = await cheerio.fromURL("https://fr.wikipedia.org/wiki/Classement_des_pilotes_de_Formule_1_par_nombre_de_victoires_en_Grand_Prix");

        const tableau = $("table");

        let lignes = [];
        tableau.find('tbody tr').each((i, row) => {
            let ligne = {};
            const cells = $(row).find('td');

            ligne["Classement"] = $(cells[0]).text().trim();
            ligne["Pilote"] = $(cells[1]).text().trim();
            ligne["Pays"] = $(cells[2]).text().trim();
            ligne["Ecurie"] = $(cells[3]).text().trim();
            ligne["Victoire"] = $(cells[4]).text().trim();
            ligne["GP disputé"] = $(cells[5]).text().trim();
            ligne["Pourcentage de victoires"] = $(cells[6]).text().trim();

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
        console.log('Données sauvegardées');
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données :", error);
    }
}

recupererTableau();
