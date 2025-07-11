import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // use env var in prod

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email already registered." });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ success: true, message: "User created successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login error." });
  }
};
