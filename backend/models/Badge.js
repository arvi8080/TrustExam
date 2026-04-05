const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' }, // Emoji or icon URL
  category: { type: String, enum: ['performance', 'trust', 'participation', 'achievement'], default: 'achievement' },
  criteria: {
    type: { type: String, enum: ['score_threshold', 'trust_score', 'exam_count', 'perfect_exam', 'no_cheating'], required: true },
    value: { type: Number, required: true }, // Threshold value (e.g., 90 for score, 95 for trust)
    operator: { type: String, enum: ['gte', 'lte', 'eq'], default: 'gte' } // greater than or equal, etc.
  },
  points: { type: Number, default: 10 }, // Points awarded for earning this badge
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
