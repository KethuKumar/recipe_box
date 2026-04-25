import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is must required"],
    },
    email: {
      type: String,
      required: [true, "email is must required"],
      unique: [true, "email is must unique"],
    },
    password: {
      type: String,
      required: [true, "password is must required"],
    },
    avatar: {
      String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("User",userSchema)

export default userModel
