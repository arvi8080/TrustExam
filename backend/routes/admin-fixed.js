const express = require('express');
const mongoose = require('mongoose');
const { auth, requireAdmin } = require('../middleware/auth');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');
const { sendInvitationEmail } = require('../services/emailService');

const router = express.Router();

// Protect all admin routes with authentication and admin role check
router.use(auth);
router.use(requireAdmin);

// Get all exams created by this logged-in admin
router.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user.id }).populate('createdBy', 'username email');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new exam
router.post('/exams', async (req, res) => {
  try {
    // Ensure required fields and defaults
    const examData = {
      ...req.body,
      createdBy: req.user.id,
      totalMarks: req.body.totalMarks || 100,
      negativeMarking: req.body.negativeMarking || 0,
      questions: req.body.questions || [],
      allowedEmails: req.body.allowedEmails || [],
      isActive: false,
      status: 'draft'
    };
    
    // Validate Date fields
    if (examData.startTime) {
      examData.startTime = new Date(examData.startTime);
      if (isNaN(examData.startTime.getTime())) {
        return res.status(400).json({ error: 'Invalid startTime format' });
      }
    } else {
      return res.status(400).json({ error: 'startTime is required' });
    }
    
    const exam = new Exam(examData);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    console.error('Exam creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update exam (owned by this admin)
router.put('/exams/:examId', async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.examId, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exam permissions (allowedEmails) (owned by this admin)
router.put('/exams/:examId/permissions', async (req, res) => {
  try {
    const { allowedEmails } = req.body;
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.examId, createdBy: req.user.id },
      { allowedEmails },
      { new: true }
    );
    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete exam (owned by this admin)
router.delete('/exams/:examId', async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.examId, createdBy: req.user.id });
    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });
    // Also delete associated questions
    await Question.deleteMany({ exam: req.params.examId });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all questions for an exam (owned by this admin)
router.get('/exams/:examId/questions', async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.examId, createdBy: req.user.id });
    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });
    const questions = await Question.find({ exam: req.params.examId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add single question to exam (owned by this admin)
router.post('/exams/:examId/questions', async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.examId, createdBy: req.user.id });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    const question = new Question({ ...req.body, exam: req.params.examId });
    await question.save();

    exam.questions = exam.questions ? [...exam.questions, question._id] : [question._id];
    await exam.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bulk upload questions via CSV and XLSX
const uploadMiddleware = require('../middleware/upload');
router.post('/exams/:examId/questions/bulk-upload', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { examId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const path = require('path');
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    let results = [];
    
    if (ext === '.csv') {
      const csv = require('csv-parser');
      req.file.buffer
        .toString()
        .split('\n')
        .slice(1)
        .forEach((line, index) => {
          if (!line.trim()) return;
          
          const [questionText, option1, option2, option3, option4, correctAnswerStr] = line.split(',');
          
          if (!questionText || !option1 || !option2 || !option3 || !option4) {
            results.push({ row: index + 2, error: 'Missing required fields' });
            return;
          }

          const correctAnswer = parseInt(correctAnswerStr);
          if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
            results.push({ row: index + 2, error: 'correct_answer must be 0-3' });
            return;
          }

          const question = new Question({
            questionText: questionText.trim(),
            options: [option1.trim(), option2.trim(), option3.trim(), option4.trim()],
            correctAnswer,
            exam: examId,
            topic: 'Bulk Upload',
            difficulty: 'medium',
            marks: 1
          });
          results.push({ row: index + 2, success: true, question });
        });
    } else if (ext === '.xlsx') {
      const XLSX = require('xlsx');
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
      
      csvData.forEach((row, index) => {
        if (!row || row.length < 6) {
          results.push({ row: index + 2, error: 'Missing required fields' });
          return;
        }
        
        const [questionText, option1, option2, option3, option4, correctAnswerStr] = row.map(cell => String(cell || '').trim());
        
        const correctAnswer = parseInt(correctAnswerStr);
        if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
          results.push({ row: index + 2, error: 'correct_answer must be 0-3' });
          return;
        }

        const question = new Question({
          questionText,
          options: [option1, option2, option3, option4],
          correctAnswer,
          exam: examId,
          topic: 'Excel Upload',
          difficulty: 'medium',
          marks: 1
        });
        results.push({ row: index + 2, success: true, question });
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use CSV or XLSX' });
    }

    // Save valid questions
    const savedQuestions = [];
    for (const result of results.filter(r => r.success && r.question)) {
      try {
        await result.question.save();
        savedQuestions.push(result.question._id);
      } catch (saveError) {
        console.error('Question save error:', saveError);
        result.error = 'Save failed';
      }
    }
    
    // Update exam
    if (savedQuestions.length > 0) {
      const exam = await Exam.findById(examId);
      if (exam) {
        exam.questions = exam.questions ? [...exam.questions, ...savedQuestions] : savedQuestions;
        await exam.save();
      }
    }
    const validCount = savedQuestions.length;
    const errorCount = results.filter(r => r.error).length;

    res.json({
      message: `${ext === '.csv' ? 'CSV' : 'Excel'} upload: ${validCount} questions saved, ${errorCount} errors`,
      savedCount: validCount,
      errorCount,
      preview: results.slice(0, 10)
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update question (partial update)
router.patch('/questions/:questionId', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update question
router.put('/questions/:questionId', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete question
router.delete('/questions/:questionId', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results for exams created by this admin
router.get('/results', async (req, res) => {
  try {
    const myExams = await Exam.find({ createdBy: req.user.id }).select('_id');
    const examIds = myExams.map(e => e._id);
    const results = await Result.find({ exam: { $in: examIds } }).populate('student exam');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== EMAIL INVITATIONS =====

// Send invitation emails to students
router.post('/exams/:examId/invite', async (req, res) => {
  try {
    const { emails } = req.body; // Array of email addresses
    const exam = await Exam.findById(req.params.examId);

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const results = [];
    for (const email of emails) {
      const result = await sendInvitationEmail(email, exam.title, exam._id);
      results.push({ email, success: result.success, error: result.error });
    }

    // Update exam's allowedEmails if not already present
    const newEmails = emails.filter(email => !exam.allowedEmails.includes(email));
    if (newEmails.length > 0) {
      exam.allowedEmails.push(...newEmails);
      await exam.save();
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      message: `Invitations sent: ${successful} successful, ${failed} failed`,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== STUDENT MANAGEMENT =====

// Get students for logged-in admin ONLY
router.get('/students', async (req, res) => {
  try {
    const myExams = await Exam.find({ createdBy: req.user.id }).select('_id allowedEmails');
    const myExamIds = myExams.map(e => e._id);
    const myAllowedEmails = myExams.flatMap(e => e.allowedEmails || []).map(email => (email || '').toLowerCase());

    const results = await Result.find({ exam: { $in: myExamIds } }).select('student');
    const studentIdsFromResults = results.map(r => r.student);

    const students = await User.find({
      role: 'student',
      $or: [
        { createdBy: req.user.id },
        { _id: { $in: studentIdsFromResults } },
        { email: { $in: myAllowedEmails } }
      ]
    }).select('-password');

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk import students
const bcryptjs = require('bcryptjs');
router.post('/students/bulk', async (req, res) => {
  try {
    const { students } = req.body; // Array of student objects
    const createdStudents = [];
    const errors = [];

    for (const studentData of students) {
      try {
        const { username, email, password } = studentData;
        const hashedPassword = await bcryptjs.hash(password, 8);
        const student = new User({
          username,
          email,
          password: hashedPassword,
          role: 'student',
          createdBy: req.user.id
        });
        await student.save();
        const studentResponse = student.toObject();
        delete studentResponse.password;
        createdStudents.push(studentResponse);
      } catch (error) {
        errors.push({ email: studentData.email, error: error.message });
      }
    }

    res.status(201).json({ created: createdStudents, errors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student profile
router.get('/students/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/unblock student
router.patch('/students/:studentId/block', async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.studentId,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: `Student ${isBlocked ? 'blocked' : 'unblocked'} successfully`, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student exam history (for this admin's exams only)
router.get('/students/:studentId/exam-history', async (req, res) => {
  try {
    const myExams = await Exam.find({ createdBy: req.user.id }).select('_id');
    const myExamIds = myExams.map(e => e._id);

    const results = await Result.find({ student: req.params.studentId, exam: { $in: myExamIds } })
      .populate('exam', 'title startTime endTime totalMarks')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== EXAM CONTROL =====

// Start exam
router.patch('/exams/:examId/start', async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.examId, createdBy: req.user.id },
      { isActive: true, status: 'active' },
      { new: true }
    );

    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });

    res.json({ message: 'Exam started successfully', exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop exam
router.patch('/exams/:examId/stop', async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.examId, createdBy: req.user.id },
      { isActive: false, status: 'completed' },
      { new: true }
    );

    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });

    // Auto-submit all active results
    await Result.updateMany(
      { exam: req.params.examId, isCompleted: false },
      { isCompleted: true, submittedAt: new Date() }
    );

    res.json({ message: 'Exam stopped and all active submissions completed', exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extend exam time
router.patch('/exams/:examId/extend', async (req, res) => {
  try {
    const { additionalMinutes } = req.body;
    const exam = await Exam.findOne({ _id: req.params.examId, createdBy: req.user.id });

    if (!exam) return res.status(404).json({ error: 'Exam not found or access denied' });

    exam.endTime = new Date((exam.endTime || new Date()).getTime() + additionalMinutes * 60000);
    await exam.save();

    res.json({ message: `Exam extended by ${additionalMinutes} minutes`, exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== LIVE EXAM MONITORING =====

// Get active exam sessions
router.get('/exams/:examId/active-sessions', async (req, res) => {
  try {
    const { examId } = req.params;
    
    if (!examId || examId === 'undefined') {
      return res.status(400).json({ error: 'Invalid exam ID provided' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: 'Invalid exam ID format' });
    }
    
    const activeResults = await Result.find({
      exam: examId,
      isCompleted: false
    }).populate('student', 'username email trustScore');

    const sessions = activeResults.map(result => ({
      studentId: result.student._id,
      studentName: result.student.username,
      studentEmail: result.student.email,
      trustScore: result.student.trustScore,
      sessionStartTime: result.sessionStartTime,
      lastActivityTime: result.lastActivityTime,
      currentQuestionIndex: result.currentQuestionIndex,
      tabSwitches: result.antiCheatingLog.tabSwitches,
      suspiciousActivities: result.antiCheatingLog.suspiciousActivities,
      ipAddress: result.ipAddress
    }));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ANTI-CHEATING OVERSIGHT =====

// Get cheating logs for an exam
router.get('/exams/:examId/cheating-logs', async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', 'username email')
      .select('student antiCheatingLog ipAddress');

    const logs = results.map(result => ({
      studentId: result.student._id,
      studentName: result.student.username,
      studentEmail: result.student.email,
      tabSwitches: result.antiCheatingLog.tabSwitches,
      suspiciousActivities: result.antiCheatingLog.suspiciousActivities,
      ipChanges: result.antiCheatingLog.ipChanges,
      isDisqualified: result.antiCheatingLog.isDisqualified,
      disqualificationReason: result.antiCheatingLog.disqualificationReason
    }));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disqualify student from exam
router.patch('/results/:resultId/disqualify', async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await Result.findByIdAndUpdate(
      req.params.resultId,
      {
        'antiCheatingLog.isDisqualified': true,
        'antiCheatingLog.disqualificationReason': reason,
        isCompleted: true,
        submittedAt: new Date()
      },
      { new: true }
    ).populate('student', 'username email');

    if (!result) return res.status(404).json({ error: 'Result not found' });

    res.json({ message: 'Student disqualified successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reduce trust score
router.patch('/students/:studentId/trust-score', async (req, res) => {
  try {
    const { reduction } = req.body;
    const student = await User.findById(req.params.studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.trustScore = Math.max(0, student.trustScore - reduction);
    await student.save();

    res.json({ message: `Trust score reduced by ${reduction}`, student: { ...student.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ANALYTICS & REPORTS =====

// Get exam analytics
router.get('/exams/:examId/analytics', async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId, isCompleted: true })
      .populate('student', 'username email');

    const totalStudents = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalStudents || 0;
    const passRate = results.filter(r => r.status === 'pass').length / totalStudents * 100 || 0;

    // Question-wise accuracy
    const questionStats = {};
    results.forEach(result => {
      result.answers.forEach(answer => {
        const qId = answer.question.toString();
        if (!questionStats[qId]) {
          questionStats[qId] = { attempts: 0, correct: 0 };
        }
        questionStats[qId].attempts++;
        if (answer.isCorrect) questionStats[qId].correct++;
      });
    });

    res.json({
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      questionStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Generate Questions
router.post('/ai/generate-questions', async (req, res) => {
  try {
    const { topic, numQuestions = 10, examId } = req.body;

    if (!topic || !examId) {
      return res.status(400).json({ error: 'topic and examId required' });
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate exactly ${numQuestions} MCQ questions on topic "${topic}".
Return ONLY JSON array of objects with these EXACT fields:
- "questionText": string question
- "options": array exactly 4 strings ["A) ...", "B) ...", "C) ...", "D) ..."]
- "correctAnswer": number 0,1,2, or 3 (index of correct option)
- "difficulty": "easy", "medium", or "hard"

Example:
[{"questionText":"What is Python?","options":["Language","Framework","Database","OS"],"correctAnswer":0,"difficulty":"easy"}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content.trim();

    let questions;
    try {
      questions = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'No questions generated' });
    }

    // Save to DB
    const saved = [];
    for (const q of questions) {
      const question = new Question({
        questionText: q.questionText || '',
        options: Array.isArray(q.options) ? q.options.slice(0,4) : [],
        correctAnswer: Math.max(0, Math.min(3, q.correctAnswer || 0)),
        exam: examId,
        topic,
        difficulty: ['easy','medium','hard'].includes(q.difficulty) ? q.difficulty : 'medium',
        marks: 1
      });
      await question.save();
      saved.push(question);
    }

    // Update exam
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questions.push(...saved.map(s => s._id));
      await exam.save();
    }

    res.json({
      success: true,
      count: saved.length,
      topic,
      preview: saved.slice(0,3)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Download results as CSV
router.get('/exams/:examId/results/csv', async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId, isCompleted: true })
      .populate('student', 'username email')
      .populate('exam', 'title');

    let csv = 'Student Name,Email,Score,Percentage,Status,Submitted At,Tab Switches,IP Address\n';

    results.forEach(result => {
      csv += `${result.student.username},${result.student.email},${result.score},${result.percentage},${result.status},${result.submittedAt},${result.antiCheatingLog.tabSwitches || 0},${result.ipAddress || 'N/A'}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`exam_${req.params.examId}_results.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== AUDIT LOGS =====

// Get audit logs (robust version)
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = [];

    // Login logs (safe)
    let recentLogins = [];
    try {
      recentLogins = await User.find({ role: 'student', lastLogin: { $exists: true } })
        .select('username email lastLogin')
        .sort({ lastLogin: -1 })
        .limit(50);
    } catch (loginErr) {
      console.warn('Login logs query failed:', loginErr.message);
    }

    recentLogins.forEach(user => {
      logs.push({
        type: 'login',
        user: user.username || 'Unknown',
        email: user.email || 'N/A',
        timestamp: user.lastLogin,
        action: 'User login'
      });
    });

    // Exam submissions for this admin's exams (safe)
    let recentSubmissions = [];
    try {
      const myExams = await Exam.find({ createdBy: req.user.id }).select('_id');
      const examIds = myExams.map(e => e._id);

      recentSubmissions = await Result.find({ exam: { $in: examIds }, isCompleted: true })
        .populate('student', 'username email')
        .populate('exam', 'title')
        .select('submittedAt')
        .sort({ submittedAt: -1 })
        .limit(50);
    } catch (submissionErr) {
      console.warn('Submissions query failed:', submissionErr.message);
    }

    recentSubmissions.forEach(result => {
      logs.push({
        type: 'exam_submission',
        user: result.student?.username || 'Unknown',
        email: result.student?.email || 'N/A',
        exam: result.exam?.title || 'N/A',
        timestamp: result.submittedAt,
        action: 'Exam submitted'
      });
    });

    // Sort by timestamp descending (safe)
    logs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    res.json(logs.slice(0, 100));
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ===== BADGE MANAGEMENT =====

// Get all badges
router.get('/badges', async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true }).populate('createdBy', 'username');
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create badge
router.post('/badges', async (req, res) => {
  try {
    const badge = new Badge({ ...req.body, createdBy: req.user.id });
    await badge.save();
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update badge
router.put('/badges/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(req.params.badgeId, req.body, { new: true });
    if (!badge) return res.status(404).json({ error: 'Badge not found' });
    res.json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete badge
router.delete('/badges/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.badgeId);
    if (!badge) return res.status(404).json({ error: 'Badge not found' });

    // Remove achievements associated with this badge
    await Achievement.deleteMany({ badge: req.params.badgeId });

    res.json({ message: 'Badge and associated achievements deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all achievements
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate('user', 'username email')
      .populate('badge', 'name description icon category points');
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manually award badge to student
router.post('/achievements/award', async (req, res) => {
  try {
    const { studentId, badgeId } = req.body;

    // Check if student already has this badge
    const existingAchievement = await Achievement.findOne({ user: studentId, badge: badgeId });
    if (existingAchievement) {
      return res.status(400).json({ error: 'Student already has this badge' });
    }

    const achievement = new Achievement({
      user: studentId,
      badge: badgeId
    });

    await achievement.save();
    await achievement.populate('user', 'username email');
    await achievement.populate('badge', 'name description icon category points');

    res.status(201).json({ message: 'Badge awarded successfully', achievement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove achievement
router.delete('/achievements/:achievementId', async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.achievementId);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
