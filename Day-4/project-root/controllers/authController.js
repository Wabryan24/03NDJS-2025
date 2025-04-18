const bcrypt = require('bcryptjs'); 
// Permet de hacher les mots de passe

const jwt = require('jsonwebtoken'); 
// Permet de générer des tokens JWT pour l'authentification

const User = require('./models/User'); 
// On importe le modèle Mongoose de l'utilisateur

const SECRET = 'secret123'; 
// Clé secrète pour signer les tokens (à stocker dans un .env en prod)


exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "L'email et le mot de passe sont requis" });


  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "L'email existe déjà" });

  if (password.length < 6)
    return res.status(400).json({ error: 'Mot de passe trop court, utilisez au moins 06 caractères' });

 
  const hashed = await bcrypt.hash(password, 10);


  const user = await User.create({ email, password: hashed, isAdmin: false });


  const { password: _, ...userWithoutPass } = user.toObject();
  res.status(201).json(userWithoutPass);
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur dans la base
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  // Comparaison des mots de passe
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Identifiants invalides" });

  // Création du token JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};


// Obtenir les infos de l'utilisateur connecté
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

  res.json(user);
};


// Liste des utilisateurs (admins)
exports.getUsers = async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser?.isAdmin)
    return res.status(403).json({ error: 'Accès refusé' });

  const users = await User.find().select('-password');
  res.json(users);
};


// Supprimer un utilisateur par ID (admin)
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

  res.json({ message: 'Utilisateur supprimé' });
};
