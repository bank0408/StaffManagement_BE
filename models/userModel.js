const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserRole = require('./enum/UserRole'); // Import the enum

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  description: { type: String },
  role: {
    type: String,
    required: true,
    // enum: ["superadmin", "leader", "lecturer"],
    enum: Object.values(UserRole), // Use values from UserRole enum
    default: UserRole.LECTURER,
  },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  deleted: { type: Boolean, default: false },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
