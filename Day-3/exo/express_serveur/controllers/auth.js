import crypto from "crypto";
import User from "../models/User.js";

export async function register(req, res) {
  const { email, password, isAdmin } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return status(409).json({
        error: "User already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isAdmin,
    });

    res.status(201).json({
      success: true,
      message: "User Registered",
      user: {
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Registration Failed",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "Email or Password Missing",
    });
  }

  try {
    const theUser = await User.findOne({ email }).select("+password");
    if (!theUser || !(await theUser.matchPassword(password))) {
      return res.status(401).json({
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: theUser._id,
        email: theUser.email,
      },
      "superSecretKey",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        email: theUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: " Error Error Error!!!",
    });
  }
}
