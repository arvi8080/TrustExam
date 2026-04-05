const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duration: { type: Number, required: true }, // in minutes
  startTime: { type: Date, required: true },
  endTime: { type: Date }, // Auto-calculated: startTime + duration minutes
  totalMarks: { type: Number, required: true },
  passingScore: { type: Number, default: 50 }, // Passing score percentage
  negativeMarking: { type: Number, default: 0 }, // Negative marks per wrong answer
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: false }, // Admin can start/stop exam
  isRandomized: { type: Boolean, default: false }, // Random question order
  isOptionsRandomized: { type: Boolean, default: false }, // Random options order
  questionPoolSize: { type: Number, default: null }, // Number of questions to pick randomly
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'completed'], default: 'draft' },
  allowedEmails: [{ type: String, default: [] }], // Email whitelist for students
  allowResume: { type: Boolean, default: false }, // Allow resuming exam after failure/crash
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to auto-calculate endTime
examSchema.pre('save', async function() {
  if (this.startTime && this.duration && !this.endTime) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60000);
  }
});

module.exports = mongoose.model('Exam', examSchema);
