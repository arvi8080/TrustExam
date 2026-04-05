const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 100 }, // Percentage of completion
  metadata: { type: mongoose.Schema.Types.Mixed } // Additional data like exam ID, score, etc.
});

module.exports = mongoose.model('Achievement', achievementSchema);
