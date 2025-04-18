const bcrypt = require('bcryptjs'); /// On importe la bibliothèque 'bcryptjs' et on la stocke dans la constante 'bcrypt'.
// Cette bibliothèque permet de hacher (chiffrer de manière sécurisée) les mots de passe,
// ce qui est utile pour sécuriser les informations sensibles des utilisateurs dans une base de données.
const jwt = require('jsonwebtoken');
// On importe la bibliothèque 'jsonwebtoken' et on la stocke dans la constante 'jwt'.
// Cette bibliothèque permet de créer, signer et vérifier des tokens JWT (JSON Web Tokens),
// qui sont souvent utilisés pour l'authentification et la gestion des sessions utilisateurs.
const users = require('../models/userModel');
// On importe l'objet 'users' depuis le fichier '../models/userModel'.
// Ce fichier contient probablement la définition du modèle d'utilisateurs (ex: schéma, méthodes...).
// 'users' est utilisé pour interagir avec les données des utilisateurs (ex: création, recherche dans la base de données).

const SECRET = 'secret123'; 

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "L'email et le mot de passe sont requis" });

  const exists = users.find(user => user.email === email);
  if (exists) return res.status(400).json({ error: "L'email existe deja" });

  if (password.length < 6) 
    return res.status(400).json({ error: 'Mot de passe trop court, utilisez au moins 06 caractères' });



  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, password: hashed, isAdmin: false, isAdmin: true };
  users.push(user);

  const { password: _, ...userWithoutPass } = user;
  res.status(201).json(userWithoutPass);



  
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Identifiants invalides" });
  
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  };
  

  exports.getMe = (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  
    res.json({ email: user.email });
  };
  

  exports.getUsers = (req, res) => {
    res.json(users.map(u => ({ id: u.id, email: u.email })));
  };
  exports.getUsers = (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user?.isAdmin) return res.status(403).json({ error: 'Accès refusé' });
  
    res.json(users.map(u => ({ id: u.id, email: u.email })));
  };
  


  exports.deleteUser = (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Utilisateur introuvable' });
  
    users.splice(index, 1);
    res.json({ message: 'Utilisateur supprimé' });
  };
  

