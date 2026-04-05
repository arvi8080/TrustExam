const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },

  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      selectedAnswer: {
        type: Number,
        required: true
      },
      correctAnswer: {
        type: Number
      },
      isCorrect: {
        type: Boolean
      }
    }
  ],

  score: {
    type: Number,
    required: [function() { return this.isCompleted; }, 'score is required for completed results']
  },

  totalQuestions: {
    type: Number,
    required: [function() { return this.isCompleted; }, 'totalQuestions is required for completed results']
  },


  percentage: {
    type: Number
  },

  status: {
    type: String,
    enum: ['pass', 'fail']
  },

  ipAddress: {
    type: String,
    required: [function() { return this.isCompleted; }, 'ipAddress is required for completed results']
  },

  isCompleted: {
    type: Boolean,
    default: false
  },


  submittedAt: {
    type: Date,
    default: Date.now
  },

  // Anti-cheating data
  antiCheatingLog: {
    tabSwitches: { type: Number, default: 0 },
    suspiciousActivities: [{ type: String }], // Array of suspicious activities
    ipChanges: [{ type: String }], // Array of IP addresses used
    timeSpent: { type: Number }, // Time spent in seconds
    isDisqualified: { type: Boolean, default: false },
    disqualificationReason: { type: String }
  },

  // Live monitoring data
  sessionStartTime: { type: Date },
  lastActivityTime: { type: Date },
  currentQuestionIndex: { type: Number, default: 0 },

  // Auto-submit data
  autoSubmitted: { type: Boolean, default: false },
  autoSubmitReason: { type: String }
});

// Prevent multiple attempts for same exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
