import express from "express";
import { registrer, login } from "../controllers/auth.js";

const router = express.Router();

router.post("register", register);
router.post("/login", login);

export default routeur;
