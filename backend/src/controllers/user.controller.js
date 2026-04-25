import userModel from "../models/user.model.js";

export const followUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user._id;

    if (userIdToFollow === currentUserId.toString()) {
      return res.status(400).json({
        message: "you can't follow yourself",
      });
    }

    const userToFollow = await userModel.findById(userIdToFollow);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // already following?
    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({
        message: "already following",
      });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    return res.json({ message: "user followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user._id;

    const currentUser = await userModel.findById(currentUserId);
    const userToUnfollow = await userModel.findById(userIdToUnfollow);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
