const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.addUser = async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
};

exports.claimPoints = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const points = Math.floor(Math.random() * 10) + 1;
  user.totalPoints += points;
  await user.save();

  const history = new ClaimHistory({ userId: user._id, pointsClaimed: points });
  await history.save();

  res.json({ user, pointsClaimed: points });
};

exports.getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  res.json(users);
};

exports.getClaimHistory = async (req, res) => {
  const history = await ClaimHistory.find({ userId: req.params.id }).sort({ timestamp: -1 });
  res.json(history);
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Also delete claim history
    await ClaimHistory.deleteMany({ userId: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
