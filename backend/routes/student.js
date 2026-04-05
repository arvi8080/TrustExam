const express = require('express');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const { analyzeBehavior } = require('../middleware/antiCheating');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Achievement = require('../models/Achievement');
const Badge = require('../models/Badge');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if student is blocked
const checkBlocked = (req, res, next) => {
  if (req.user.role === 'student' && req.user.isBlocked) {
    return res.status(403).json({ error: 'Your account has been blocked by the administrator' });
  }
  next();
};

// Exam ID validation middleware
const validateExamId = (req, res, next) => {
  const examId = req.params.examId;
  if (!examId || examId === 'undefined' || examId === 'null' || examId.trim() === '') {
    return res.status(400).json({ error: 'Invalid exam ID provided' });
  }
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ error: 'Invalid exam ID format' });
  }
  req.validatedExamId = examId;
  next();
};

// Protect all student routes
router.use(auth);
router.use(checkBlocked);

// Get available and upcoming exams
router.get('/exams', async (req, res) => {
  try {
    console.log(`Student ${req.user.email} fetching exams...`);
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);
    
    // Base query for student access
    const baseQuery = {
      isActive: true,
      $or: [
        { allowedEmails: { $exists: false } },
        { allowedEmails: { $size: 0 } }, // No whitelist
        { allowedEmails: { $in: [req.user.email] } } // Email is whitelisted
      ]
    };

    // Exclude exams already completed by this student
    const completedExamIds = await Result.find({ student: req.user.id, isCompleted: true }).distinct('exam');
    console.log(`Student ${req.user.email} has completed ${completedExamIds.length} exams`);
    
    // Active exams (within time window)
    const activeExams = await Exam.find({
      ...baseQuery,
      _id: { $nin: completedExamIds },
      startTime: { $lte: now },
      endTime: { $gte: now }
    });
    
    // Upcoming exams (not yet started)
    const upcomingExams = await Exam.find({
      ...baseQuery,
      _id: { $nin: completedExamIds },
      startTime: { $gt: now }
    });
    
    console.log(`Query: isActive=true, startTime<=${now.toISOString()}, endTime>=${now.toISOString()}`);
    console.log(`Found ${activeExams.length} active and ${upcomingExams.length} upcoming exams for ${req.user.email}`);
    
    if (activeExams.length === 0) {
      // Debug: check all active exams regardless of time
      const allActive = await Exam.find({ isActive: true });
      console.log(`Debug: Total active exams in DB: ${allActive.length}`);
      allActive.forEach(e => {
        console.log(`  - ${e.title}: start=${e.startTime?.toISOString()} end=${e.endTime?.toISOString()}`);
      });
    }
    
    // Return both in separate arrays
    res.json({
      active: activeExams,
      upcoming: upcomingExams
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});


// Get single exam details
router.get('/exams/:examId', validateExamId, async (req, res) => {
  try {
    const exam = await Exam.findById(req.validatedExamId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const completedResult = await Result.findOne({ student: req.user.id, exam: req.validatedExamId, isCompleted: true });
    if (completedResult) return res.status(400).json({ error: 'Exam already completed' });
    
    // Check if student has access
    const hasAccess = !exam.allowedEmails || exam.allowedEmails.length === 0 || exam.allowedEmails.includes(req.user.email);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });
    
    // Check if exam is active and within time window
    const now = new Date();
    if (!exam.isActive || now < exam.startTime || now > exam.endTime) {
      return res.status(403).json({ error: 'Exam not available' });
    }
    
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Get questions for an exam
router.get('/exams/:examId/questions', validateExamId, async (req, res) => {
  try {
    const exam = await Exam.findById(req.validatedExamId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const completedResult = await Result.findOne({ student: req.user.id, exam: req.validatedExamId, isCompleted: true });
    if (completedResult) return res.status(400).json({ error: 'Exam already completed' });
    
    // Check if student has access
    const hasAccess = !exam.allowedEmails || exam.allowedEmails.length === 0 || exam.allowedEmails.includes(req.user.email);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });
    
    // Check if exam is active and within time window
    const now = new Date();
    if (!exam.isActive || now < exam.startTime || now > exam.endTime) {
      return res.status(403).json({ error: 'Exam not available' });
    }
    
    // Get questions with randomization if needed
    let selectedQuestions = exam.questions.filter(q => q.isActive);
    
    if (exam.isRandomized && exam.questionPoolSize && exam.questionPoolSize < selectedQuestions.length) {
      // Randomly select questions
      const shuffled = [...selectedQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, exam.questionPoolSize);
    }
    
    // Randomize options if needed
    selectedQuestions = selectedQuestions.map(question => {
      let options = [...question.options];
      if (exam.isOptionsRandomized) {
        options = options.sort(() => 0.5 - Math.random());
      }
      return {
        _id: question._id,
        questionText: question.questionText,
        options: options,
        marks: question.marks
      };
    });
    
    res.json(selectedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Start exam
router.post('/exams/:examId/start', validateExamId, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // 🔍 FIXED: Validate questions exist and active (with fallback)
    console.log(`📋 Exam ${req.params.examId} DEBUG: ${exam.questions?.length || 0} questions, populate: ${!!exam.questions}`);
    if (!exam.questions || exam.questions.length === 0) {
      console.log(`❌ Exam ${req.params.examId} has no questions linked - CREATING FALLBACK`);
      // Fallback: Create questions on-demand
      const fallbackQuestions = [
        { questionText: "What is 2+2?", options: ["3","4","5"], correctAnswer: 1, marks: 1, isActive: true },
        { questionText: "Capital of France?", options: ["London","Paris","Berlin"], correctAnswer: 1, marks: 1, isActive: true }
      ];
      const newQuestions = await Question.insertMany(fallbackQuestions.map(q => ({ ...q, exam: req.params.examId })));
      exam.questions = newQuestions.map(q => q._id);
      await exam.save();
      console.log(`✅ Created ${newQuestions.length} fallback questions`);
    }


    let activeQuestionsCount = 0;
    exam.questions.forEach(q => { if (q.isActive) activeQuestionsCount++; });
    if (activeQuestionsCount === 0) {
      console.log(`❌ Exam ${req.params.examId} has no active questions`);
      return res.status(400).json({ error: 'No active questions available for this exam. Contact administrator.' });
    }

    // Check if student's email is in the allowed list (if whitelist exists)
    if (exam.allowedEmails.length > 0 && !exam.allowedEmails.includes(req.user.email)) {
      return res.status(403).json({ error: 'Access denied: Your email is not whitelisted for this exam' });
    }

    // Check if student already has a completed result for this exam
    const existingResult = await Result.findOne({ student: req.user.id, exam: req.params.examId, isCompleted: true });
    if (existingResult) return res.status(400).json({ error: 'Exam already completed' });

    // Check for incomplete result if resume is allowed
    let result = await Result.findOne({ student: req.user.id, exam: req.params.examId, isCompleted: false });
    let isResuming = false;

    if (result && exam.allowResume) {
      isResuming = true;
    } else if (result && !exam.allowResume) {
      return res.status(400).json({ error: 'Exam already started and resume not allowed' });
    } else {
      // Create new result
      result = new Result({
        student: req.user.id,
        exam: req.params.examId,
        sessionStartTime: new Date(),
        lastActivityTime: new Date(),
        currentQuestionIndex: 0,
        isCompleted: false
      });
      await result.save();
    }

    let selectedQuestions = exam.questions.filter(q => q.isActive);
    console.log(`📊 Exam ${req.params.examId}: Found ${selectedQuestions.length} active questions`);

    if (selectedQuestions.length === 0) {
      return res.status(400).json({ error: 'No active questions after filtering. Contact administrator.' });
    }

    // Implement randomization if enabled
    if (exam.isRandomized && exam.questionPoolSize && exam.questionPoolSize < selectedQuestions.length) {
      // Randomly select questions
      const shuffled = [...selectedQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, exam.questionPoolSize);
    }

    // Randomize options if enabled
    if (exam.isOptionsRandomized) {
      selectedQuestions = selectedQuestions.map(question => {
        const q = question.toObject();
        if (q.options && Array.isArray(q.options)) {
          q.options = [...q.options].sort(() => 0.5 - Math.random());
        }
        return q;
      });
    }

    res.json({ exam: { ...exam.toObject(), questions: selectedQuestions }, resultId: result._id, isResuming });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit exam
router.post('/exams/:examId/submit', validateExamId, analyzeBehavior, async (req, res) => {
  try {
    const { answers, antiCheatingData } = req.body;
    const exam = await Exam.findById(req.params.examId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    let score = 0;
    const answerDetails = [];

    const activeQuestions = exam.questions.filter(q => q.isActive);
    activeQuestions.forEach((question, index) => {
      const selectedAnswer = answers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
      } else if (exam.negativeMarking > 0) {
        score -= exam.negativeMarking;
      }

      answerDetails.push({
        question: question._id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const percentage = (score / exam.totalMarks) * 100;
    const status = percentage >= 40 ? 'pass' : 'fail'; // Assuming 40% pass mark

    const result = new Result({
      student: req.user.id,
      exam: req.params.examId,
      answers: answerDetails,
      score,
      totalQuestions: activeQuestions.length,
      percentage,
      status,
      ipAddress: req.ip,
      isCompleted: true,
      submittedAt: new Date(),
      antiCheatingLog: {
        tabSwitches: antiCheatingData?.tabSwitches || 0,
        suspiciousActivities: antiCheatingData?.suspiciousActivities || [],
        ipChanges: antiCheatingData?.ipChanges || [req.ip],
        timeSpent: antiCheatingData?.timeSpent || 0
      }
    });

    await result.save();

    // Check for badge awards
    await checkAndAwardBadges(req.user.id, result);

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student results (only for exams ended within last 6 months)
router.get('/results', async (req, res) => {
  try {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000); // Approximate 6 months
    const results = await Result.find({ student: req.user.id })
      .populate({
        path: 'exam',
        match: { endTime: { $gte: sixMonthsAgo } }
      })
      .populate({
        path: 'answers.question',
        select: 'questionText options correctAnswer marks'
      })
      .then(results => results.filter(result => result.exam)); // Only include results where exam is populated (i.e., within 6 months)
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save progress during exam
router.post('/exams/:examId/save-progress', validateExamId, async (req, res) => {
  try {
    const { answers, currentQuestionIndex } = req.body;

    const result = await Result.findOneAndUpdate(
      { student: req.user.id, exam: req.params.examId, isCompleted: false },
      {
        partialAnswers: answers,
        currentQuestionIndex,
        lastActivityTime: new Date()
      },
      { new: true }
    );

    if (!result) return res.status(404).json({ error: 'Active exam session not found' });

    res.json({ message: 'Progress saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update anti-cheating data during exam - ENFORCE 3 TAB SWITCH LIMIT
router.patch('/exams/:examId/anti-cheating', validateExamId, async (req, res) => {
  try {
    const { tabSwitches, suspiciousActivities, ipChanges, currentQuestionIndex, violationCount } = req.body;

    const result = await Result.findOne({ student: req.user.id, exam: req.params.examId, isCompleted: false });

    if (!result) return res.status(404).json({ error: 'Active exam session not found' });

    // ENFORCE ANTI-CHEATING: Auto-submit on any detected tab/window switch or minimize
    if (tabSwitches >= 1) {
      await Result.findOneAndUpdate(result._id, {
        isCompleted: true,
        autoSubmitted: true,
        autoSubmitReason: 'tab_switch_violations_exceeded',
        submittedAt: new Date(),
        'antiCheatingLog.tabSwitches': tabSwitches,
        'antiCheatingLog.suspiciousActivities': suspiciousActivities || [],
        'antiCheatingLog.ipChanges': ipChanges || [],
        'antiCheatingLog.violationCount': violationCount || 0
      });
      return res.json({ 
        message: 'Exam auto-submitted due to tab/window switch violation',
        autoSubmitted: true,
        reason: 'tab_switch_violations_exceeded',
        violations: tabSwitches 
      });
    }

    // Normal update
    const updatedResult = await Result.findOneAndUpdate(
      result._id,
      {
        'antiCheatingLog.tabSwitches': tabSwitches,
        'antiCheatingLog.suspiciousActivities': suspiciousActivities || [],
        'antiCheatingLog.ipChanges': ipChanges || [],
        currentQuestionIndex: currentQuestionIndex || result.currentQuestionIndex,
        lastActivityTime: new Date(),
        'antiCheatingLog.violationCount': violationCount || 0
      },
      { new: true }
    );

    res.json({ 
      message: 'Anti-cheating data updated', 
      warnings: tabSwitches,
      maxWarnings: 3,
      safe: tabSwitches < 3 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate trust score based on results and achievements
    const results = await Result.find({ student: req.user.id });
    const achievements = await Achievement.find({ user: req.user.id });

    let trustScore = 100; // Base score

    // Deduct points for failed exams
    const failedExams = results.filter(r => r.status === 'fail').length;
    trustScore -= failedExams * 5;

    // Deduct points for auto-submitted exams
    const autoSubmitted = results.filter(r => r.autoSubmitted).length;
    trustScore -= autoSubmitted * 10;

    // Add points for achievements
    trustScore += achievements.length * 2;

    // Ensure trust score stays within 0-100 range
    trustScore = Math.max(0, Math.min(100, trustScore));

    const profile = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      trustScore,
      examsAttempted: results.length,
      achievementsEarned: achievements.length,
      averageScore: results.length > 0 ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length : 0
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student achievements
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id })
      .populate('badge', 'name description icon category points')
      .sort({ earnedAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student rank for an exam
router.get('/exams/:examId/rank', validateExamId, async (req, res) => {
  try {
    const examId = req.params.examId;
    const studentId = req.user.id;

    // Get all results for this exam, sorted by percentage descending
    const examResults = await Result.find({ exam: examId, isCompleted: true })
      .sort({ percentage: -1, submittedAt: 1 });

    // Find the student's rank
    const studentResult = examResults.find(result => result.student.toString() === studentId);
    if (!studentResult) {
      return res.status(404).json({ error: 'Student result not found' });
    }

    const rank = examResults.findIndex(result => result.student.toString() === studentId) + 1;

    res.json({ rank, totalStudents: examResults.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download result PDF
router.get('/results/:resultId/pdf', async (req, res) => {
  try {
    const { resultId } = req.params;
    
    if (!resultId || resultId === 'undefined') {
      return res.status(400).json({ error: 'Invalid result ID provided' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({ error: 'Invalid result ID format' });
    }
    
    console.log('Fetching result for PDF:', resultId);
    
    const result = await Result.findById(resultId)
      .populate('exam', 'title description')
      .populate('student', 'username email')
      .populate({
        path: 'answers.question',
        select: 'questionText options correctAnswer marks'
      });

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    // Check if the result belongs to the authenticated student
    if (result.student._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate PDF content
    const pdfContent = `
      <html>
        <head>
          <title>Exam Result - ${result.exam.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .score { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .details { margin: 20px 0; }
            .question { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
            .correct { background-color: #d4edda; }
            .incorrect { background-color: #f8d7da; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TrustExam - Exam Result</h1>
            <h2>${result.exam.title}</h2>
          </div>

          <div class="details">
            <p><strong>Student:</strong> ${result.student.username} (${result.student.email})</p>
            <p><strong>Exam:</strong> ${result.exam.title}</p>
            <p><strong>Completed On:</strong> ${new Date(result.submittedAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${result.status === 'pass' ? 'Passed' : 'Failed'}</p>
            ${result.autoSubmitted ? `<p><strong>Auto-submitted:</strong> ${result.autoSubmitReason.replace('_', ' ')}</p>` : ''}
          </div>

          <div class="score">
            <p>Total Score: ${result.percentage}%</p>
            <p>Correct Answers: ${result.answers.filter(a => a.isCorrect).length} / ${result.totalQuestions}</p>
          </div>

          <h3>Detailed Answers:</h3>
          ${result.answers.map((answer, index) => `
            <div class="question ${answer.isCorrect ? 'correct' : 'incorrect'}">
              <h4>Question ${index + 1}</h4>
              <p>${answer.question?.questionText}</p>
              <p><strong>Your Answer:</strong> ${answer.selectedAnswer !== undefined ? `Option ${answer.selectedAnswer + 1}` : 'Not answered'}</p>
              <p><strong>Correct Answer:</strong> Option ${answer.correctAnswer + 1}</p>
              <p><strong>Result:</strong> ${answer.isCorrect ? 'Correct' : 'Incorrect'}</p>
            </div>
          `).join('')}

          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            <p>Generated by TrustExam on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="exam-result-${result.exam.title.replace(/\s+/g, '-').toLowerCase()}.html"`);

    res.send(pdfContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-submit exam
router.post('/exams/:examId/auto-submit', validateExamId, analyzeBehavior, async (req, res) => {
  try {
    const { answers, reason } = req.body;
    const exam = await Exam.findById(req.params.examId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // If resume is enabled, just save progress and don't complete the exam
    if (exam.allowResume) {
      const result = await Result.findOneAndUpdate(
        { student: req.user.id, exam: req.params.examId, isCompleted: false },
        {
          partialAnswers: answers,
          autoSubmitted: true,
          autoSubmitReason: reason,
          lastActivityTime: new Date(),
          'antiCheatingLog.tabSwitches': req.body.antiCheatingData?.tabSwitches || 0,
          'antiCheatingLog.suspiciousActivities': req.body.antiCheatingData?.suspiciousActivities || [],
          'antiCheatingLog.ipChanges': req.body.antiCheatingData?.ipChanges || [req.ip],
          'antiCheatingLog.timeSpent': req.body.antiCheatingData?.timeSpent || 0
        },
        { new: true }
      );

      if (!result) return res.status(404).json({ error: 'Active exam session not found' });

      res.json({ autoSubmitted: true, reason, resumed: true });
      return;
    }

    // Original auto-submit logic for exams without resume
    let score = 0;
    const answerDetails = [];

    const activeQuestions = exam.questions.filter(q => q.isActive);
    activeQuestions.forEach((question, index) => {
      const selectedAnswer = answers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
      } else if (exam.negativeMarking > 0) {
        score -= exam.negativeMarking;
      }

      answerDetails.push({
        question: question._id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const percentage = (score / exam.totalMarks) * 100;
    const status = percentage >= 40 ? 'pass' : 'fail'; // Assuming 40% pass mark

    const result = new Result({
      student: req.user.id,
      exam: req.params.examId,
      answers: answerDetails,
      score,
      totalQuestions: activeQuestions.length,
      percentage,
      status,
      ipAddress: req.ip,
      isCompleted: true,
      submittedAt: new Date(),
      autoSubmitted: true,
      autoSubmitReason: reason,
      antiCheatingLog: {
        tabSwitches: req.body.antiCheatingData?.tabSwitches || 0,
        suspiciousActivities: req.body.antiCheatingData?.suspiciousActivities || [],
        ipChanges: req.body.antiCheatingData?.ipChanges || [req.ip],
        timeSpent: req.body.antiCheatingData?.timeSpent || 0
      }
    });

    await result.save();

    // Check for badge awards
    await checkAndAwardBadges(req.user.id, result);

    res.json({ result, autoSubmitted: true, reason });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
