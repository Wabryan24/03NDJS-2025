import crypto from "crypto"
import User from "../models/User.js";

export async function register(req, res) {
const { email, password, isAdmin } = req.body;

try {
const userExist = await User.findone({ email});
if 
