const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of options
  correctAnswer: { type: Number, required: true }, // Index of correct option
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  marks: { type: Number, default: 1 }, // Marks for this question
  tags: [{ type: String }], // For categorization and learning paths
  topic: { type: String },
  isActive: { type: Boolean, default: true }, // Whether to show in exam
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
