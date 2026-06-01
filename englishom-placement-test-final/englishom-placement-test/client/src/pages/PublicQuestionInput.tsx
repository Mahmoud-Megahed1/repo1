'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Save, X, Download, Upload, Image as ImageIcon, Music } from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { id: 'visual_recognition', label: 'Visual Recognition', labelAr: 'التعرف البصري' },
  { id: 'auditory_processing', label: 'Auditory Processing', labelAr: 'معالجة السمعية' },
  { id: 'spelling_structure', label: 'Spelling & Structure', labelAr: 'الإملاء والبنية' },
  { id: 'reading_sprint', label: 'Reading Sprint', labelAr: 'سباق القراءة' },
  { id: 'vocal_challenge', label: 'Vocal Challenge', labelAr: 'تحدي الصوت' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', labelAr: 'مبتدئ' },
  { id: 'elementary', label: 'Elementary', labelAr: 'ابتدائي' },
  { id: 'intermediate', label: 'Intermediate', labelAr: 'متوسط' },
  { id: 'upper_intermediate', label: 'Upper-Intermediate', labelAr: 'متوسط متقدم' },
  { id: 'advanced', label: 'Advanced', labelAr: 'متقدم' },
];

interface Question {
  id: string;
  stage: string;
  level: string;
  questionText: string;
  imageData?: string;
  audioData?: string;
  correctAnswer: string;
  options: string[];
}

export default function PublicQuestionInput() {
  const [language, setLanguage] = useState('en');
  const isArabic = language === 'ar';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const [formData, setFormData] = useState({
    stage: '',
    level: '',
    questionText: '',
    imageData: '',
    audioData: '',
    correctAnswer: '',
    options: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [audioPreview, setAudioPreview] = useState<string>('');

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(isArabic ? 'يرجى اختيار صورة' : 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isArabic ? 'حجم الصورة كبير جداً (الحد الأقصى 5MB)' : 'Image file is too large (max 5MB)');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, imageData: base64 });
      setImagePreview(base64);
      setUploadingImage(false);
      toast.success(isArabic ? 'تم تحميل الصورة' : 'Image uploaded');
    };
    reader.onerror = () => {
      setUploadingImage(false);
      toast.error(isArabic ? 'خطأ في تحميل الصورة' : 'Error uploading image');
    };
    reader.readAsDataURL(file);
  };

  // Handle audio file upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error(isArabic ? 'يرجى اختيار ملف صوتي' : 'Please select an audio file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(isArabic ? 'حجم الملف الصوتي كبير جداً (الحد الأقصى 10MB)' : 'Audio file is too large (max 10MB)');
      return;
    }

    setUploadingAudio(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, audioData: base64 });
      setAudioPreview(base64);
      setUploadingAudio(false);
      toast.success(isArabic ? 'تم تحميل الملف الصوتي' : 'Audio uploaded');
    };
    reader.onerror = () => {
      setUploadingAudio(false);
      toast.error(isArabic ? 'خطأ في تحميل الملف الصوتي' : 'Error uploading audio');
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuestion = () => {
    if (!formData.stage || !formData.level || !formData.questionText || !formData.correctAnswer) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const optionsArray = formData.options
      .split(',')
      .map((opt) => opt.trim())
      .filter((opt) => opt);

    if (optionsArray.length === 0) {
      toast.error(isArabic ? 'يرجى إضافة خيارات' : 'Please add options');
      return;
    }

    const newQuestion: Question = {
      id: editingId || Date.now().toString(),
      stage: formData.stage,
      level: formData.level,
      questionText: formData.questionText,
      imageData: formData.imageData || undefined,
      audioData: formData.audioData || undefined,
      correctAnswer: formData.correctAnswer,
      options: optionsArray,
    };

    if (editingId) {
      setQuestions(questions.map((q) => (q.id === editingId ? newQuestion : q)));
      setEditingId(null);
      toast.success(isArabic ? 'تم تحديث السؤال' : 'Question updated');
    } else {
      setQuestions([...questions, newQuestion]);
      toast.success(isArabic ? 'تم إضافة السؤال' : 'Question added');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      stage: '',
      level: '',
      questionText: '',
      imageData: '',
      audioData: '',
      correctAnswer: '',
      options: '',
    });
    setImagePreview('');
    setAudioPreview('');
    setShowForm(false);
  };

  const handleEditQuestion = (question: Question) => {
    setFormData({
      stage: question.stage,
      level: question.level,
      questionText: question.questionText,
      imageData: question.imageData || '',
      audioData: question.audioData || '',
      correctAnswer: question.correctAnswer,
      options: question.options.join(', '),
    });
    setImagePreview(question.imageData || '');
    setAudioPreview(question.audioData || '');
    setEditingId(question.id);
    setShowForm(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success(isArabic ? 'تم حذف السؤال' : 'Question deleted');
  };

  const filteredQuestions = questions.filter((q) => {
    const stageMatch = !filterStage || q.stage === filterStage;
    const levelMatch = !filterLevel || q.level === filterLevel;
    return stageMatch && levelMatch;
  });

  const downloadJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success(isArabic ? 'تم تحميل البيانات' : 'Data downloaded');
  };

  return (
    <div className={`min-h-screen ${isArabic ? 'rtl' : 'ltr'} transition-colors duration-200`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">{isArabic ? 'لوحة إدخال الأسئلة' : 'Question Input Panel'}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Add Question Button */}
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {isArabic ? 'إضافة سؤال جديد' : 'Add New Question'}
        </Button>

        {/* Form */}
        {showForm && (
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4">
              {/* Stage Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'المرحلة' : 'Stage'} *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">{isArabic ? 'اختر المرحلة' : 'Select Stage'}</option>
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isArabic ? s.labelAr : s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'المستوى' : 'Level'} *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">{isArabic ? 'اختر المستوى' : 'Select Level'}</option>
                  {LEVELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {isArabic ? l.labelAr : l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'نص السؤال' : 'Question Text'} *
                </label>
                <Textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder={isArabic ? 'أدخل نص السؤال' : 'Enter question text'}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'تحميل صورة' : 'Upload Image'}
                </label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {imagePreview && (
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, imageData: '' });
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border border-gray-300" />
                  </div>
                )}
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'تحميل ملف صوتي' : 'Upload Audio'}
                </label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="flex-1 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {audioPreview && (
                    <button
                      onClick={() => {
                        setAudioPreview('');
                        setFormData({ ...formData, audioData: '' });
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {audioPreview && (
                  <div className="mt-2">
                    <audio controls className="w-full max-w-xs">
                      <source src={audioPreview} />
                      {isArabic ? 'متصفحك لا يدعم تشغيل الصوت' : 'Your browser does not support audio playback'}
                    </audio>
                  </div>
                )}
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'الإجابة الصحيحة' : 'Correct Answer'} *
                </label>
                <Input
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder={isArabic ? 'أدخل الإجابة الصحيحة' : 'Enter correct answer'}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  {isArabic ? 'الخيارات (مفصولة بفواصل)' : 'Options (comma-separated)'} *
                </label>
                <Textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder={isArabic ? 'مثال: خيار 1, خيار 2, خيار 3' : 'Example: option 1, option 2, option 3'}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddQuestion}
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? (isArabic ? 'تحديث' : 'Update') : (isArabic ? 'حفظ' : 'Save')}
                </Button>
                <Button
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              {isArabic ? 'تصفية حسب المرحلة' : 'Filter by Stage'}
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">{isArabic ? 'جميع المراحل' : 'All Stages'}</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {isArabic ? s.labelAr : s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              {isArabic ? 'تصفية حسب المستوى' : 'Filter by Level'}
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">{isArabic ? 'جميع المستويات' : 'All Levels'}</option>
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {isArabic ? l.labelAr : l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Download Button */}
        {questions.length > 0 && (
          <Button
            onClick={downloadJSON}
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isArabic ? 'تحميل البيانات (JSON)' : 'Download Data (JSON)'}
          </Button>
        )}

        {/* Questions List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            {isArabic ? 'الأسئلة المضافة' : 'Added Questions'} ({filteredQuestions.length})
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="p-4 dark:bg-gray-800 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isArabic ? 'المرحلة' : 'Stage'}: {STAGES.find((s) => s.id === question.stage)?.[isArabic ? 'labelAr' : 'label']}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isArabic ? 'المستوى' : 'Level'}: {LEVELS.find((l) => l.id === question.level)?.[isArabic ? 'labelAr' : 'label']}
                      </p>
                      <p className="font-semibold mt-2 dark:text-white">{question.questionText}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {isArabic ? 'الإجابة الصحيحة' : 'Correct Answer'}: {question.correctAnswer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isArabic ? 'الخيارات' : 'Options'}: {question.options.join(', ')}
                      </p>
                      {question.imageData && (
                        <div className="mt-2 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600">{isArabic ? 'صورة مرفقة' : 'Image attached'}</span>
                        </div>
                      )}
                      {question.audioData && (
                        <div className="mt-2 flex items-center gap-2">
                          <Music className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-600">{isArabic ? 'ملف صوتي مرفق' : 'Audio attached'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
