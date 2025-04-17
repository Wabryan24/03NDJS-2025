const bcrypt = require('bcryptjs'); /// On importe la bibliothèque 'bcryptjs' et on la stocke dans la constante 'bcrypt'.
// Cette bibliothèque permet de hacher (chiffrer de manière sécurisée) les mots de passe,
// ce qui est utile pour sécuriser les informations sensibles des utilisateurs dans une base de données.
const jwt = require('jsonwebtoken');
// On importe la bibliothèque 'jsonwebtoken' et on la stocke dans la constante 'jwt'.
// Cette bibliothèque permet de créer, signer et vérifier des tokens JWT (JSON Web Tokens),
// qui sont souvent utilisés pour l'authentification et la gestion des sessions utilisateurs.
const { users } = require('../models/userModel');
// On importe l'objet 'users' depuis le fichier '../models/userModel'.
// Ce fichier contient probablement la définition du modèle d'utilisateurs (ex: schéma, méthodes...).
// 'users' est utilisé pour interagir avec les données des utilisateurs (ex: création, recherche dans la base de données).

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10); 
const newUser = { id: users.length + 1, email, password: hashedPassword };
users.push(newUser);

const userResponse = { id: newUser.id, email: newUser.email };
res.status(201).json(userResponse);
} catch (error) {
console.error(error);
res.status(500).json({ message: "L' inscription a échoué" });
}
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers,
    deleteUser
  };