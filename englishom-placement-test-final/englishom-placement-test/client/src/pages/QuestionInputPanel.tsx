import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

const STAGES = [
  { id: 'visual', label: 'Visual Recognition', labelAr: 'التعرف البصري' },
  { id: 'auditory', label: 'Auditory Processing', labelAr: 'معالجة السمعية' },
  { id: 'spelling', label: 'Spelling & Structure', labelAr: 'الإملاء والبنية' },
  { id: 'reading', label: 'Reading Sprint', labelAr: 'سباق القراءة' },
  { id: 'vocal', label: 'Vocal Challenge', labelAr: 'تحدي الصوت' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', labelAr: 'مبتدئ' },
  { id: 'elementary', label: 'Elementary', labelAr: 'ابتدائي' },
  { id: 'intermediate', label: 'Intermediate', labelAr: 'متوسط' },
  { id: 'upper-intermediate', label: 'Upper-Intermediate', labelAr: 'متوسط متقدم' },
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

export default function QuestionInputPanel() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('englishom_questions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading questions from localStorage:', error);
      return [];
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('englishom_questions', JSON.stringify(questions));
    } catch (error) {
      console.error('Error saving questions to localStorage:', error);
    }
  }, [questions]);

  const [formData, setFormData] = useState({
    stage: '',
    level: '',
    questionText: '',
    imageData: '',
    audioData: '',
    correctAnswer: '',
    options: '',
  });

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

  const handleEdit = (question: Question) => {
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

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success(isArabic ? 'تم حذف السؤال' : 'Question deleted');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isArabic ? 'يرجى اختيار صورة' : 'Please select an image file');
      return;
    }

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

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error(isArabic ? 'يرجى اختيار ملف صوتي' : 'Please select an audio file');
      return;
    }

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

  const filteredQuestions = questions.filter((q) => {
    if (filterStage && q.stage !== filterStage) return false;
    if (filterLevel && q.level !== filterLevel) return false;
    return true;
  });

  return (
    <div className={`min-h-screen ${isArabic ? 'rtl' : 'ltr'} bg-white dark:bg-slate-950`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {isArabic ? 'لوحة إدخال الأسئلة' : 'Question Input Panel'}
        </h1>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? 'المرحلة' : 'Stage'}
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="">{isArabic ? 'الكل' : 'All'}</option>
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {isArabic ? stage.labelAr : stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? 'المستوى' : 'Level'}
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="">{isArabic ? 'الكل' : 'All'}</option>
              {LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {isArabic ? level.labelAr : level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'إضافة سؤال' : 'Add Question'}
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'المرحلة' : 'Stage'} *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  <option value="">{isArabic ? 'اختر المرحلة' : 'Select Stage'}</option>
                  {STAGES.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {isArabic ? stage.labelAr : stage.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'المستوى' : 'Level'} *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  <option value="">{isArabic ? 'اختر المستوى' : 'Select Level'}</option>
                  {LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {isArabic ? level.labelAr : level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'نص السؤال' : 'Question Text'} *
                </label>
                <Textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder={isArabic ? 'أدخل نص السؤال' : 'Enter question text'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'تحميل صورة' : 'Upload Image'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'تحميل ملف صوتي' : 'Upload Audio'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    disabled={uploadingAudio}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
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
                    <audio src={audioPreview} controls className="w-full" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'الإجابة الصحيحة' : 'Correct Answer'} *
                </label>
                <Input
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder={isArabic ? 'أدخل الإجابة الصحيحة' : 'Enter correct answer'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'الخيارات (مفصولة بفواصل)' : 'Options (comma-separated)'} *
                </label>
                <Textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder={isArabic ? 'خيار 1, خيار 2, خيار 3' : 'Option 1, Option 2, Option 3'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button
                  onClick={handleAddQuestion}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? (isArabic ? 'تحديث' : 'Update') : (isArabic ? 'حفظ' : 'Save')}
                </Button>
                <Button
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Questions List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'الأسئلة المضافة' : 'Added Questions'} ({filteredQuestions.length})
          </h2>

          {filteredQuestions.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <p className="text-gray-600 dark:text-gray-400">
                {isArabic ? 'لم تضف أي أسئلة بعد' : 'No questions added yet'}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="p-4 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                          {STAGES.find((s) => s.id === question.stage)?.[isArabic ? 'labelAr' : 'label']}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded">
                          {LEVELS.find((l) => l.id === question.level)?.[isArabic ? 'labelAr' : 'label']}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">{question.questionText}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isArabic ? 'الإجابة الصحيحة' : 'Correct Answer'}: {question.correctAnswer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isArabic ? 'الخيارات' : 'Options'}: {question.options.join(', ')}
                      </p>
                      {question.imageData && (
                        <p className="text-sm text-blue-600 dark:text-blue-400">📷 {isArabic ? 'صورة' : 'Image'}</p>
                      )}
                      {question.audioData && (
                        <p className="text-sm text-green-600 dark:text-green-400">🔊 {isArabic ? 'صوت' : 'Audio'}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(question)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(question.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* JSON Export */}
        {questions.length > 0 && (
          <Card className="mt-8 p-6 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {isArabic ? 'تصدير البيانات (JSON)' : 'Data Export (JSON)'}
            </h3>
            <pre className="bg-white dark:bg-slate-800 p-4 rounded-lg overflow-auto text-xs text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700">
              {JSON.stringify(questions, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
