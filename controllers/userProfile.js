import User from '../models/user.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(404);
      throw new Error('Profile Entity Registry Missing.');
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('Profile Target Modification Error: Entity not found.');
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User structural profile scrubbed completely.' });
    } else {
      res.status(404);
      throw new Error('Account target identity verification mapping failed.');
    }
  } catch (error) {
    next(error);
  }
};