const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    auth0Id: { type: String, unique: true, required: true },
    age: { type: Number },
    gender: { type: String },
    profileData: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);