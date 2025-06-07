const User = require('../models/User');

const syncUser = async (req, res) => {
  const { name, email, auth0Id } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      const emailMatch = await User.findOne({ email });

      if (emailMatch) {
        if (emailMatch.auth0Id !== auth0Id) {
          console.log('Email already linked to another Auth0 user:', email);
          return res.status(409).json({ error: 'Email already linked to another account' });
        }

        console.log('Returning existing user with matching email + auth0Id');
        return res.status(200).json(emailMatch);
      }

      user = await User.create({ name, email, auth0Id });
      console.log('User created in MongoDB');
    } else {
      console.log('User already exists in MongoDB');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error syncing user:', err);
    res.status(500).json({ error: 'Server error syncing user' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  syncUser,
  getUser,
};