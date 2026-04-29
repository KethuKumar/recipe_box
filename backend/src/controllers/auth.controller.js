import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// export const register = async(req,res)

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    const response = {
      user: user._id,
      user: user.username,
      email: user.email,
    };

    return res.status(201).json({
      message: "user created successfully",
      user: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "inter server error",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "login sucessful",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "inter server error",
      error: error.message,
    });
  }
}
