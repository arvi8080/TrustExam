const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  ipAddress: { type: String }, // For IP-based restrictions
  trustScore: { type: Number, default: 100, min: 0, max: 100 }, // Trust score for anti-cheating
  isBlocked: { type: Boolean, default: false }, // Admin can block/unblock students
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created/imported student
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Password hashing is done in the auth route

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
