// AI Question Generation endpoint - add to routes/admin.js or separate route

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/ai/generate-questions', async (req, res) => {
  try {
    const { topic, numQuestions = 10, examId } = req.body;

    if (!topic || !examId) {
      return res.status(400).json({ error: 'topic and examId required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const prompt = `Generate ${numQuestions} multiple choice questions on "${topic}".
Each question should have:
- questionText (string)
- options: array of 4 strings
- correctAnswer: 0,1,2, or 3 (index)
- difficulty: "easy", "medium", or "hard"

Variety difficulties. Return ONLY valid JSON array of objects with these exact fields.

Example:
[
  {
    "questionText": "What is 2+2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "difficulty": "easy"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedText = completion.choices[0].message.content.trim();
    
    // Parse JSON from response
    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(generatedText);
    } catch (parseError) {
      // Fallback: use regex or manual parse if malformed JSON
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse generated questions' });
    }

    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      return res.status(400).json({ error: 'No questions generated' });
    }

    // Validate generated questions but don't save yet
    const validatedQuestions = [];
    const errors = [];

    for (let i = 0; i < generatedQuestions.length; i++) {
      const genQ = generatedQuestions[i];
      if (!genQ.questionText || !Array.isArray(genQ.options) || typeof genQ.correctAnswer !== 'number') {
        errors.push(`Question ${i + 1}: Invalid format`);
        continue;
      }

      const question = {
        questionText: genQ.questionText,
        options: genQ.options.slice(0, 4), // Ensure 4 options
        correctAnswer: Math.min(Math.max(genQ.correctAnswer, 0), 3), // Clamp 0-3
        difficulty: ['easy', 'medium', 'hard'].includes(genQ.difficulty) ? genQ.difficulty : 'medium',
        topic: topic,
        marks: 1,
        isActive: true
      };

      validatedQuestions.push(question);
    }

    res.json({
      message: `${validatedQuestions.length} questions generated from topic "${topic}"`,
      generated: validatedQuestions.length,
      errors: errors.length,
      questions: validatedQuestions
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
  }
});

