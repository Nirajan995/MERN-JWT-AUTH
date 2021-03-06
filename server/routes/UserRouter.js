import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";

const router = express.Router();
// const User = require("../models/UserModels");

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    //validation
    if (!email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "Password length must be greater than 6" });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({ errorMessage: "Password must be same" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "An account with this email already exists" });
    }

    //hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //save new User
    const newUser = new User({ email, passwordHash });

    const savedUser = await newUser.save();

    //log in user
    const token = jwt.sign({ user: savedUser._id }, "mySecretkey");

    //send the token in a cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    // sign the token

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      "mySecretkey"
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});
export default router;
