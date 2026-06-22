import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, BookOpen, Mic, TrendingUp, Award, MessageCircle, Zap, Users, Smartphone, Lock, Headphones, Tablet, Laptop } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * صفحة الهبوط الرئيسية لمنصة إنجليشوم
 * تصميم عصري بالوضع الليلي مع تركيز على الممارسة اليومية والتحول الشخصي
 */

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [coursesData, setCoursesData] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://api.englishom.com/courses')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setCoursesData(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch courses:", err));
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "نظام المهام العشر اليومية",
      description: "20 كلمة يومياً × 50 يوم = 1000 كلمة. تعلم كل كلمة بـ 5 طرق: قراءة، استماع، تحدث، كتابة، وصورة مع معنى إنجليزي.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mic,
      title: "السيناريوهات الحياتية الواقعية",
      description: "تدريب نطق 25 ثانية يومي من سيناريوهات واقعية مع تحليل ذكي. نسبة نجاح 75% مطلوبة للاجتياز مع مقارنة صوتك بالنطق الأصلي.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Headphones,
      title: "ملف صوتي تذكاري شخصي",
      description: "احصل على ملف صوتي بـ 17 دقيقة من صوتك في نهاية الكورس كذكريات دائمة. حمّله واحتفظ به كمرجع شخصي لك.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "نظام المتابعة الذكي",
      description: "تنبيهات تحفيزية كل 5 أيام، تجميد ذكي للطوارئ (20 يوم × مرحلتين)، ومساعد ذكي يحفزك بعد كل 10 مهام.",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: "devices",
      title: "مرونة الأجهزة الكاملة",
      description: "تعلم من أي مكان على جوالك أو آيباد أو لابتوب. المنصة متوافقة تماماً مع جميع الأجهزة والشاشات.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "tamara",
      title: "خدمة التقسيط بـ تمارا",
      description: "ادفع على دفعات مريحة باستخدام خدمة تمارا. لا حاجة للقلق بشأن الدفع الكامل مقدماً.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const baseLevels = [
    {
      number: 1,
      code: "A1",
      level_name: "LEVEL_A1",
      name: "المستوى الأول",
      description: "مستوى مبتدئ للغة الإنجليزية",
      details: "تعلم القواعد الأساسية والمفردات الضرورية للتواصل اليومي",
      color: "from-blue-600 to-blue-700",
      status: "متاح حاليا للتسجيل",
      price: "999 ريال"
    },
    {
      number: 2,
      code: "A2",
      level_name: "LEVEL_A2",
      name: "المستوى الأساسي",
      description: "تطوير المهارات الأساسية في اللغة الإنجليزية",
      details: "طور مفرداتك والتعبيرات الشائعة للمحادثات اليومية",
      color: "from-cyan-500 to-cyan-600",
      status: "قريبا",
      price: null
    },
    {
      number: 3,
      code: "B1",
      level_name: "LEVEL_B1",
      name: "المستوى المتوسط",
      description: "بناء الثقة في التواصل باللغة الإنجليزية",
      details: "قوّ طلاقتك وثقتك في التحدث والكتابة",
      color: "from-green-500 to-green-600",
      status: "قريبا",
      price: null
    },
    {
      number: 4,
      code: "B2",
      level_name: "LEVEL_B2",
      name: "المستوى فوق المتوسط",
      description: "إتقان المهارات المتقدمة في اللغة الإنجليزية",
      details: "حقق الإتقان والتواصل بتأثير في جميع المواقف",
      color: "from-orange-500 to-orange-600",
      status: "قريبا",
      price: null
    }
  ];

  const levels = baseLevels.map(level => {
    const course = coursesData.find(c => c.level_name === level.level_name);
    if (course) {
      return {
        ...level,
        name: course.titleAr || level.name,
        description: course.descriptionAr || level.description,
        status: course.isAvailable ? "متاح حاليا للتسجيل" : "قريبا",
        price: course.showPrice && course.price ? `${course.price} ريال` : null,
        daysCount: course.daysCount || 50
      };
    }
    return { ...level, daysCount: 50 };
  });

  const faqs = [
    {
      question: "كيف يعمل نظام المهام العشر اليومية؟",
      answer: "كل يوم تتعلم 20 كلمة جديدة بـ 5 طرق مختلفة: قراءة، استماع، تحدث، كتابة، وصورة. بعد 50 يوم، ستكون قد تعلمت 1000 كلمة بشكل شامل وعملي."
    },
    {
      question: "ما هي السيناريوهات الحياتية الواقعية؟",
      answer: "كل يوم تتدرب على سيناريو واقعي من الحياة اليومية لمدة 25 ثانية. يقارن النظام صوتك بالنطق الأصلي ويعطيك نسبة نجاح. يجب أن تصل إلى 75% للاجتياز."
    },
    {
      question: "هل سأحصل على ملف صوتي في النهاية؟",
      answer: "نعم! في نهاية الكورس، ستحصل على ملف صوتي بـ 17 دقيقة من صوتك وهو يتحدث الإنجليزية. يمكنك تحميله والاحتفاظ به كذكريات دائمة."
    },
    {
      question: "ماذا يحدث إذا توقفت عن الدراسة؟",
      answer: "إذا لم تدخل لمدة 5 أيام، ستتلقى تنبيهات تحفيزية. إذا استمر الانقطاع 15 يوماً، سيتم إيقاف اشتراكك مؤقتاً حتى تعود. يمكنك استئناف الاشتراك متى شئت."
    },
    {
      question: "هل هناك خيار تجميد الاشتراك للطوارئ؟",
      answer: "نعم! بعد إكمال 20 يوم دراسي، يمكنك تجميد اشتراكك لمدة 20 يوم (مرتين). هذا يحافظ على مدة اشتراكك الأصلية."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .pulse-animate {
          animation: pulse-scale 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/966542577250?text=مرحباً%20بك%20في%20Englishom%20-%20هل%20لديك%20أي%20استفسارات؟"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="تواصل معنا عبر الواتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://englishom.com/logo.jpeg" alt="Englishom" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-xl font-bold text-white" style={{fontFamily: 'Poppins, sans-serif'}}>Englishom</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">المميزات</a>
            <a href="#levels" className="text-gray-300 hover:text-white transition">المستويات</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">الأسئلة الشائعة</a>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">ابدأ الآن</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-1 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight text-center" style={{fontFamily: 'Tajawal, sans-serif'}}>
                  أتقن اللغة الإنجليزية <span className="text-6xl md:text-7xl font-bold" style={{color: '#00D4FF'}}>بثقة</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed text-center" style={{fontFamily: 'Tajawal, sans-serif'}}>
                  تحول من "أريد أن أتحدث الإنجليزية" إلى "أنا أتحدث الإنجليزية بطلاقة" من خلال الممارسة اليومية والتفاعل المباشر.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 border-0" onClick={() => window.location.href = 'https://englishom.com/ar/login'}>
                  ابدأ رحلتك الآن
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8" onClick={() => window.location.href = 'https://englishom.com/ar'}>
                  اعرف المزيد
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">95%</div>
                  <div className="text-gray-400">معدل النجاح</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">آلاف</div>
                  <div className="text-gray-400">المتعلمين النشطين</div>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">لماذا تختار Englishom؟</h2>
            <p className="text-xl text-gray-400">ميزات حصرية وفريدة لا تجدها في أي منصة أخرى</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const isCustomIcon = feature.icon === "devices" || feature.icon === "tamara";
              return (
                <Card key={index} className="bg-black/50 border-gray-700 hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-blue-500/10 p-8 group">
                  {feature.icon === "devices" ? (
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform flex items-end justify-center pb-3 gap-2`}>
                      <Laptop className="w-9 h-9 text-white opacity-90" />
                      <Tablet className="w-7 h-7 text-white opacity-90" />
                      <Smartphone className="w-5 h-5 text-white opacity-90" />
                    </div>
                  ) : feature.icon === "tamara" ? (
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg tracking-wide" style={{fontFamily: 'Poppins, sans-serif'}}>tamara</span>
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform`}>
                      {(() => { const Icon = feature.icon as React.ComponentType<{className?: string}>; return <Icon className="w-full h-full text-white" />; })()}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-center">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">اختر مسارك التعليمي</h2>
            <p className="text-xl text-gray-400">مسارات تعليمية مصممة<br />خصيصاً لكل مستوى</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {levels.map((level, index) => (
              <Card key={index} className={`bg-gradient-to-br ${level.color} border-0 p-8 text-white hover:shadow-2xl transition-all hover:scale-105 flex flex-col`}>
                <div className="text-5xl font-bold mb-6 text-center opacity-90" style={{fontFamily: 'Tajawal, sans-serif'}}>{level.code}</div>
                <h3 className="text-3xl font-bold mb-4 text-center" style={{fontFamily: 'Tajawal, sans-serif'}}>{level.name}</h3>
                <p className="text-2xl text-white/80 mb-4 text-center font-semibold" style={{fontFamily: 'Tajawal, sans-serif'}}>{level.description}</p>
                <p className="text-2xl text-white/70 mb-6 flex-grow text-center font-semibold" style={{fontFamily: 'Tajawal, sans-serif'}}>{level.details}</p>
                <div className="mt-auto pt-6 border-t border-white/20">
                  <p className="text-base font-semibold mb-3 text-center">{level.daysCount} يوم من الممارسة المنظمة</p>
                  <p className="text-lg font-bold mb-3 text-center">{level.status}</p>
                  {level.price && <p className="text-5xl font-bold text-yellow-300 mb-4 text-center pulse-animate">{level.price}</p>}
                  <Button 
                    size="lg" 
                    className={`w-full font-bold text-lg ${
                      level.price 
                        ? 'bg-white text-slate-900 hover:bg-slate-100' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0'
                    }`}
                    onClick={() => {
                      if (level.price) {
                        alert('يجب عليك التسجيل في الموقع أولاً للاشتراك في هذا المستوى');
                        window.location.href = 'https://englishom.com/ar/login';
                      }
                    }}
                    disabled={!level.price}
                  >
                    {level.price ? 'اشترك الآن' : 'قريبا'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1000</div>
              <p className="text-gray-300">كلمة في 50 يوم</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">5</div>
              <p className="text-gray-300">طرق تعلم لكل كلمة</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">17</div>
              <p className="text-gray-300">دقيقة ملف صوتي شخصي</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">75%</div>
              <p className="text-gray-300">نسبة النجاح المطلوبة</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">الأسئلة الشائعة</h2>
            <p className="text-xl text-gray-400">إجابات على الأسئلة الشائعة حول منصة Englishom</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 p-6 cursor-pointer hover:border-gray-600 transition-all">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-white text-right">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {expandedFaq === index && (
                  <p className="text-gray-300 mt-4 text-right leading-relaxed">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">هل أنت مستعد لتغيير حياتك؟</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك نحو إتقان اللغة الإنجليزية اليوم. مع Englishom، ستصل إلى أهدافك بثقة وسرعة.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-12 border-0" onClick={() => window.location.href = 'https://englishom.com/ar/login'}>
              ابدأ اليوم
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-12" onClick={() => window.location.href = 'https://englishom.com/ar'}>
              اعرف المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <img src="https://englishom.com/logo.jpeg" alt="Englishom" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-white" style={{fontFamily: 'Poppins, sans-serif'}}>Englishom</span>
            </div>
            <a href="https://englishom.com/ar" className="text-gray-300 hover:text-white transition font-semibold">زيارة الموقع</a>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © 2026 Englishom. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
