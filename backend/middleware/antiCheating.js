const Result = require('../models/Result');

// Middleware to check if user has already taken the exam from the same IP
const checkIPRestriction = async (req, res, next) => {
  try {
    const examId = req.params.examId;
    const userIP = req.ip;

    const existingResult = await Result.findOne({
      exam: examId,
      ipAddress: userIP,
      isCompleted: true
    });

    if (existingResult) {
      return res.status(403).json({ error: 'Exam already taken from this IP address.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to log anti-cheating events
const logAntiCheatingEvent = (eventType, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[ANTI-CHEATING] ${timestamp} - ${eventType}: ${details}`);
};

// Middleware to enforce fullscreen (client-side enforcement needed)
const enforceFullscreen = (req, res, next) => {
  // This would typically be handled on the client-side
  // Server-side can log attempts to exit fullscreen
  next();
};

// Middleware to detect and log tab switches (requires client-side reporting)
const detectTabSwitch = (req, res, next) => {
  // This is handled client-side, but server can receive logs
  next();
};

// Middleware to block shortcuts (client-side)
const blockShortcuts = (req, res, next) => {
  // Client-side implementation
  next();
};

// Middleware to analyze behavior (AI-based proctoring simulation)
const analyzeBehavior = (req, res, next) => {
  // Simulate behavior analysis (in a real implementation, this would analyze webcam/screen data, etc.)
  req.behaviorData = {
    suspiciousActivities: [], // e.g., ['tab_switch', 'fullscreen_exit']
    confidenceScore: 0.95, // AI confidence in cheating detection
    analysisTimestamp: new Date().toISOString()
  };
  next();
};

module.exports = {
  checkIPRestriction,
  enforceFullscreen,
  logAntiCheatingEvent,
  detectTabSwitch,
  blockShortcuts,
  analyzeBehavior
};
