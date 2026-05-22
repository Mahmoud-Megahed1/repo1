import { useState } from 'react';
import { Save, BarChart3, Settings } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  todayRegistrations: number;
  topCountry: string;
  topCountryCount: number;
  lastRegistration: string;
}

const AdminDashboard = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 24903,
    todayRegistrations: 343,
    topCountry: language === 'ar' ? 'مصر' : 'Egypt',
    topCountryCount: 4300,
    lastRegistration: language === 'ar' ? 'السعودية' : 'Saudi Arabia',
  });

  const [formData, setFormData] = useState({
    totalUsers: stats.totalUsers,
    todayRegistrations: stats.todayRegistrations,
    topCountry: stats.topCountry,
    topCountryCount: stats.topCountryCount,
    lastRegistration: stats.lastRegistration,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    setStats({
      totalUsers: Number(formData.totalUsers),
      todayRegistrations: Number(formData.todayRegistrations),
      topCountry: formData.topCountry,
      topCountryCount: Number(formData.topCountryCount),
      lastRegistration: formData.lastRegistration,
    });
    alert(language === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully');
  };

  const translations = {
    ar: {
      title: 'لوحة تحكم الإدارة',
      subtitle: 'إدارة بيانات لوحة البيانات الحية',
      totalUsers: 'إجمالي المستخدمين',
      todayRegistrations: 'التسجيلات اليوم',
      topCountry: 'أكثر الدول',
      topCountryCount: 'عدد المسجلين من الدولة',
      lastRegistration: 'آخر تسجيل من',
      save: 'حفظ البيانات',
      preview: 'معاينة البيانات',
      language: 'اللغة',
      current: 'الحالية',
    },
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Manage Live Dashboard Data',
      totalUsers: 'Total Users',
      todayRegistrations: 'Today\'s Registrations',
      topCountry: 'Top Country',
      topCountryCount: 'Country Count',
      lastRegistration: 'Last Registration From',
      save: 'Save Data',
      preview: 'Data Preview',
      language: 'Language',
      current: 'Current',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">{t.title}</h1>
            <p className="text-gray-400">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-cyan-400">{language === 'ar' ? 'تحديث البيانات' : 'Update Data'}</h2>
            </div>

            <div className="space-y-4">
              {/* Total Users */}
              <div>
                <label className="block text-cyan-400 font-semibold mb-2">{t.totalUsers}</label>
                <input
                  type="number"
                  value={formData.totalUsers}
                  onChange={(e) => handleInputChange('totalUsers', e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Today Registrations */}
              <div>
                <label className="block text-cyan-400 font-semibold mb-2">{t.todayRegistrations}</label>
                <input
                  type="number"
                  value={formData.todayRegistrations}
                  onChange={(e) => handleInputChange('todayRegistrations', e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Top Country */}
              <div>
                <label className="block text-cyan-400 font-semibold mb-2">{t.topCountry}</label>
                <input
                  type="text"
                  value={formData.topCountry}
                  onChange={(e) => handleInputChange('topCountry', e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Top Country Count */}
              <div>
                <label className="block text-cyan-400 font-semibold mb-2">{t.topCountryCount}</label>
                <input
                  type="number"
                  value={formData.topCountryCount}
                  onChange={(e) => handleInputChange('topCountryCount', e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Last Registration */}
              <div>
                <label className="block text-cyan-400 font-semibold mb-2">{t.lastRegistration}</label>
                <input
                  type="text"
                  value={formData.lastRegistration}
                  onChange={(e) => handleInputChange('lastRegistration', e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
              >
                <Save size={20} />
                {t.save}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-cyan-400">{t.preview}</h2>
            </div>

            <div className="space-y-4">
              {/* Preview Cards */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400/70 text-sm mb-1">{t.totalUsers}</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalUsers.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400/70 text-sm mb-1">{t.todayRegistrations}</p>
                <p className="text-3xl font-bold text-blue-400">{stats.todayRegistrations}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400/70 text-sm mb-1">{t.topCountry}</p>
                <p className="text-2xl font-bold text-purple-400">{stats.topCountry}</p>
                <p className="text-purple-400/70 text-sm mt-2">{stats.topCountryCount.toLocaleString()} {language === 'ar' ? 'مسجل' : 'registered'}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400/70 text-sm mb-1">{t.lastRegistration}</p>
                <p className="text-2xl font-bold text-orange-400">{stats.lastRegistration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-cyan-400 font-semibold mb-2">
            {language === 'ar' ? '💡 ملاحظة' : '💡 Note'}
          </p>
          <p className="text-gray-400 text-sm">
            {language === 'ar' 
              ? 'البيانات المدخلة هنا سيتم عرضها مباشرة في لوحة البيانات الحية. تأكد من صحة البيانات قبل الحفظ.'
              : 'Data entered here will be displayed directly on the Live Dashboard. Make sure data is correct before saving.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
