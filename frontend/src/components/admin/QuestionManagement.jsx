import React from 'react';
import { useState, useEffect } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { useExams } from '../../hooks/useExams';
import QuestionsTable from './QuestionsTable';
import QuestionForm from './QuestionForm';

const QuestionManagement = ({ examId }) => {
  const { questions, loading, error, fetchQuestions, createQuestion, updateQuestion, deleteQuestion, bulkUpload, generateQuestions } = useQuestions();
  const { exams, fetchExams } = useExams();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(10);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedGenerated, setSelectedGenerated] = useState(new Set());

  useEffect(() => {
    if (examId) {
      fetchQuestions(examId);
    }
  }, [examId, fetchQuestions]);

  const handleEdit = (question) => {
    setEditingItem(question);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    const success = editingItem 
      ? await updateQuestion(editingItem._id, formData)
      : await createQuestion(examId, formData);
    
    if (success) {
      setShowForm(false);
      setEditingItem(null);
    }
  };

  const handleToggleActive = async (questionId, isActive) => {
    try {
      await updateQuestion(questionId, { isActive });
      fetchQuestions(examId);
    } catch (error) {
      alert('Failed to update question status: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const results = await bulkUpload(examId, file);
      setUploadPreview(results);
      setUploadFile(null);
    } catch (error) {
      alert('File upload failed: ' + error.message);
      setUploadPreview([{ success: false, error: error.message }]);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(questionId);
      fetchQuestions(examId);
    } catch (error) {
      alert('Failed to delete question: ' + error.message);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) return;
    
    try {
      setGenerating(true);
      const result = await generateQuestions(examId, aiTopic, aiNumQuestions);
      setGeneratedQuestions(result.questions || []);
      setSelectedGenerated(new Set());
      setAiTopic('');
    } catch (error) {
      alert('AI generation failed: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddSelectedQuestions = async () => {
    const selectedQuestions = generatedQuestions.filter((_, index) => selectedGenerated.has(index));
    if (selectedQuestions.length === 0) return;

    try {
      for (const question of selectedQuestions) {
        await createQuestion(examId, question);
      }
      setGeneratedQuestions([]);
      setSelectedGenerated(new Set());
      alert(`${selectedQuestions.length} questions added successfully!`);
    } catch (error) {
      alert('Failed to add questions: ' + error.message);
    }
  };

  const toggleGeneratedSelection = (index) => {
    const newSelected = new Set(selectedGenerated);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGenerated(newSelected);
  };

  return (
    <div className="space-y-8">
      {/* AI Generation Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">🤖 AI Question Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Enter topic (e.g. Python Loops)"
            className="px-4 py-3 rounded-lg bg-white/20 backdrop-blur text-white placeholder-white/70 border border-white/30 focus:outline-none focus:border-white/50"
          />
          <input
            type="number"
            value={aiNumQuestions}
            onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 10)}
            min="1"
            max="50"
            placeholder="Number of questions"
            className="px-4 py-3 rounded-lg bg-white/20 backdrop-blur text-white placeholder-white/70 border border-white/30 focus:outline-none focus:border-white/50"
          />
          <button
            onClick={handleGenerateAI}
            disabled={!aiTopic.trim() || generating}
            className="bg-white/20 hover:bg-white/30 transition-all duration-200 px-6 py-3 rounded-lg font-semibold border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </div>

      {/* Generated Questions Selection */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">🤖 Generated Questions ({generatedQuestions.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGenerated(new Set(generatedQuestions.map((_, i) => i)))}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedGenerated(new Set())}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Deselect All
              </button>
              <button
                onClick={handleAddSelectedQuestions}
                disabled={selectedGenerated.size === 0}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected ({selectedGenerated.size})
              </button>
              <button
                onClick={() => setGeneratedQuestions([])}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generatedQuestions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedGenerated.has(index)}
                    onChange={() => toggleGeneratedSelection(index)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{question.questionText}</p>
                      <span className={`px-2 py-1 text-xs rounded ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`p-2 rounded ${
                          optIndex === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}>
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                          {optIndex === question.correctAnswer && <span className="text-green-600 ml-2">✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Form */}
      {showForm && (
        <QuestionForm
          question={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Bulk Upload */}
      {!showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">📁 Bulk Upload CSV/Excel</h3>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            <button
              disabled={!uploadPreview || uploading}
              onClick={() => { setUploadPreview(null); }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload Preview'}
            </button>
          </div>
          {uploadPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Preview: {uploadPreview.length} rows processed</h4>
              <div className="text-sm text-gray-600 max-h-32 overflow-auto">
                {uploadPreview.map((item, i) => (
                  <div key={i} className={`p-1 ${item.success ? 'text-green-700' : 'text-red-700'}`}>
                    Row {item.row}: {item.success ? '✅' : item.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions Table */}
      {!showForm && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Questions ({questions.length})</h3>
            <button
              onClick={handleCreate}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200 font-medium"
            >
              Add New Question
            </button>
          </div>
          <QuestionsTable
            questions={questions}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
