import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, BookOpen, Mic, TrendingUp, Award, MessageCircle, Zap, Users, Smartphone, Lock, Headphones, Tablet, Laptop, Check, Youtube, Instagram, Send, Facebook, Mail, MapPin, Music2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * صفحة الهبوط الرئيسية لمنصة إنجليشوم
 * تصميم عصري بالوضع الليلي مع تركيز على الممارسة اليومية والتحول الشخصي
 */

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    fetch('https://api.englishom.com/api/courses')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCoursesData(data);
        } else if (data && data.data) {
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
    },
    {
      number: 5,
      code: "C1",
      level_name: "LEVEL_C1",
      name: "إصدار الخبراء المتقدم",
      description: "تحقيق معايير التحدث التلقائي والتحليل البرمجي المعقد للنصوص",
      details: "تفعيل معايير المعالجة اللغوية وأداة التدقيق الصياغي الهيكلي وتحديات التدفق الصوتي التلقائي",
      color: "from-blue-500 to-blue-600",
      status: "قريبا",
      price: null
    },
    {
      number: 6,
      code: "C2",
      level_name: "LEVEL_C2",
      name: "نظام المحاكاة الاحترافية الكاملة",
      description: "التدفق التقني الكامل ومحاكاة بيئات التحدث القيادية",
      details: "مخرجات التدفق الصوتي الشامل ومعالجة النصوص التخصصية المعقدة وأنظمة الحوار التفاعلي",
      color: "from-purple-500 to-purple-600",
      status: "قريبا",
      price: null
    }
  ];

  const levelFeatures: Record<string, string[]> = {
    LEVEL_A1: [
      "تهيئة البيئة البرمجية الأولى",
      "تفعيل خاصية المحاكاة الصوتية",
      "تتبع التحديثات الصوتية الإلزامية",
      "معالجة ومطابقة البصمة الصوتية",
      "تحليل فوري لدقة مخارج الصوت"
    ],
    LEVEL_A2: [
      "محاكاة التفاعل اللفظي الحي",
      "خوارزميات وصف السيناريوهات اليومية",
      "أنظمة الصياغة الزمنية التفاعلية",
      "معالجة برمجية متقدمة للنطق",
      "قواعد بيانات المواقف التفاعلية"
    ],
    LEVEL_B1: [
      "برمجيات ومصطلحات قطاع الأعمال",
      "أداة التدقيق والتركيب الهيكلي",
      "تحديات النطق المتقدم",
      "محاكاة معايير التحدث الطبيعي",
      "أنظمة الحوار المعقد والممتد"
    ],
    LEVEL_B2: [
      "معايير الممارسة الاحترافية",
      "التدقيق والتركيب المتقدم للنصوص",
      "محاكاة النقاشات التقنية الممتدة",
      "أنظمة السياق اللغوي الطبيعي",
      "تحليل التوافق التقني للصوت"
    ],
    LEVEL_C1: [
      "تفعيل معايير المعالجة اللغوية",
      "أداة التدقيق الصياغي الهيكلي",
      "تحديات التدفق الصوتي التلقائي",
      "خوارزميات التحليل اللغوي المتقدم",
      "تحليل الانسيابية البرمجية للنطق"
    ],
    LEVEL_C2: [
      "مخرجات التدفق الصوتي الشامل",
      "معالجة النصوص التخصصية المعقدة",
      "أنظمة الحوار التفاعلي المعقد",
      "تحديات الصياغة الاستراتيجية",
      "محاكاة التحدث القيادي الشامل"
    ]
  };

  const levels = baseLevels.map(level => {
    const course = coursesData.find(c => c.level_name === level.level_name);
    const features = levelFeatures[level.level_name] || [];
    if (course) {
      return {
        ...level,
        name: course.titleAr || level.name,
        description: course.descriptionAr || level.description,
        status: course.isAvailable ? "متاح حاليا للتسجيل" : "قريبا",
        price: course.showPrice && course.price ? `${course.price} ريال` : null,
        originalPrice: course.originalPrice ? `${course.originalPrice} ريال` : null,
        daysCount: course.daysCount || 50,
        isTrialEnabled: course.isTrialEnabled ?? false,
        features
      };
    }
    return { ...level, daysCount: 50, isTrialEnabled: false, features };
  });

  const getGradient = (id: string) => {
    switch (id) {
      case 'LEVEL_A1': return 'from-[#279B5A] via-[#279B5A]/20 to-transparent';
      case 'LEVEL_A2': return 'from-[#E27625] via-[#E27625]/20 to-transparent';
      case 'LEVEL_B1': return 'from-[#D4A346] via-[#D4A346]/20 to-transparent';
      case 'LEVEL_B2': return 'from-[#D94579] via-[#D94579]/20 to-transparent';
      case 'LEVEL_C1': return 'from-[#297BCE] via-[#297BCE]/20 to-transparent';
      case 'LEVEL_C2': return 'from-[#8A21C6] via-[#8A21C6]/20 to-transparent';
      default: return 'from-gray-600 via-gray-900/20 to-transparent';
    }
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level, index) => (
              <Card key={index} className="relative overflow-hidden border-none bg-[#1C1C1E] text-white hover:shadow-2xl transition-all hover:scale-105 flex flex-col min-h-[500px]">
                {/* Top Gradient Overlay */}
                <div className={cn("absolute inset-0 h-2/3 bg-gradient-to-b opacity-80 pointer-events-none", getGradient(level.level_name))} />

                {/* Days Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    {level.price ? `${level.daysCount} يوماً` : 'قريباً'}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col flex-grow p-8">
                  {/* Header */}
                  <div className="text-center pb-2 pt-4">
                    <div className="text-lg font-medium mb-1 drop-shadow-md">
                      (مسار {level.code})
                    </div>
                    <h3 className="text-2xl font-bold drop-shadow-md" style={{fontFamily: 'Tajawal, sans-serif'}}>{level.name}</h3>
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col flex-grow space-y-6 pt-2">
                    {level.price ? (
                      <div className="flex flex-col items-center justify-center min-h-[70px]">
                        <span className="text-white flex items-center gap-1 text-4xl font-bold">
                          {level.price}
                        </span>
                        {level.originalPrice && (
                          <span className="text-gray-400 flex items-center gap-1 text-lg line-through mt-0.5">
                            {level.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-[70px]">
                        <span className="text-gray-400 text-lg font-semibold">قريباً</span>
                      </div>
                    )}

                    {/* Features List */}
                    <div className="w-fit mx-auto flex-grow">
                      <ul className="space-y-2.5">
                        {(level.features || []).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-gray-200">
                            <Check className="text-white h-4 w-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 mt-auto flex flex-col gap-2">
                      {level.price ? (
                        <>
                          <Button 
                            size="lg" 
                            className="w-full font-bold text-lg py-5 rounded-lg bg-white text-black hover:bg-gray-100"
                            onClick={() => {
                              alert('يجب عليك التسجيل في الموقع أولاً للاشتراك في هذا المستوى');
                              window.location.href = 'https://englishom.com/ar/login';
                            }}
                          >
                            اشترك الآن
                          </Button>
                          {level.isTrialEnabled && (
                            <Button 
                              size="lg" 
                              variant="outline"
                              className="w-full font-bold text-lg py-4 rounded-lg border-white/20 text-white hover:bg-white/10"
                              onClick={() => {
                                window.location.href = `https://englishom.com/ar/app/levels/${level.level_name}`;
                              }}
                            >
                              جرب ليوم واحد ←
                            </Button>
                          )}
                        </>
                      ) : level.isTrialEnabled ? (
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="w-full font-bold text-lg py-5 rounded-lg border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
                          onClick={() => {
                            window.location.href = `https://englishom.com/ar/app/levels/${level.level_name}`;
                          }}
                        >
                          جرب ليوم واحد ←
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          className="w-full font-bold text-lg py-5 rounded-lg bg-gray-700 text-gray-400 border-none cursor-not-allowed"
                          disabled
                        >
                          قريباً
                        </Button>
                      )}
                    </div>
                  </div>
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
      <footer className="bg-[#222222] dark:bg-[#0a0a0a] text-white py-16 transition-colors duration-300 border-t border-gray-800" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 mb-12 text-right">
            {/* Brand */}
            <div className="col-span-full space-y-4 lg:col-span-1">
              <a href="https://englishom.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img 
                  src="https://englishom.com/logo.jpeg" 
                  alt="Englishom" 
                  className="w-10 h-10 rounded-lg"
                />
                <h3 className="text-xl font-bold">Englishom</h3>
              </a>
              <p className="text-[#CCCCCC] text-sm leading-relaxed">
                طور لغتك الإنجليزية مع منصة Englishom. نوفر لك أفضل الأدوات والمصادر لتعلم اللغة بكفاءة وسرعة، مع دعم مستمر طوال رحلة التعلم.
              </p>
            </div>

            {/* Test Your Language */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">اختبر لغتك</h4>
              <ul className="space-y-2 text-[#CCCCCC] text-sm">
                <li><a href="https://englishom.com/ques" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">مستوى الكفاءة</a></li>
                <li><a href="https://englishom.com/test" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">اكتشف مستواك</a></li>
                <li><a href="https://englishom.com/test1" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">مؤشر الإنجاز</a></li>
                <li><a href="https://englishom.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">المدونة</a></li>
              </ul>
            </div>

            {/* Training & Practice */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">التدريب والممارسة</h4>
              <ul className="space-y-2 text-[#CCCCCC] text-sm">
                <li><a href="https://englishom.com/Landingpage/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">ابدأ الممارسة الذكية</a></li>
                <li><a href="https://englishom.com/ar/login" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">تسجيل الدخول</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">الدعم</h4>
              <ul className="space-y-2 text-[#CCCCCC] text-sm">
                <li><a href="https://englishom.com/ar/user-guide" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">دليل المستخدم</a></li>
                <li><a href="https://englishom.com/ar/contact" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">اتصل بنا</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">قانوني</h4>
              <ul className="space-y-2 text-[#CCCCCC] text-sm">
                <li><a href="https://englishom.com/ar/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">الشروط والأحكام</a></li>
                <li><a href="https://englishom.com/ar/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5BB41] transition-colors duration-300">سياسة الخصوصية</a></li>
                <li>
                  <button
                    onClick={() => setShowDisclaimer(true)}
                    className="hover:text-[#F5BB41] transition-colors duration-300 text-right w-full bg-transparent border-0 p-0 cursor-pointer text-sm font-inherit text-[#CCCCCC]"
                  >
                    إخلاء المسؤولية
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#444444] my-8"></div>

          {/* Payment & Trust Badges Section */}
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="bg-white/5 dark:bg-white/10 rounded-xl py-2 px-3 sm:px-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 border border-white/10 max-w-full">
              <img
                src="https://englishom.com/images/svgs/saudi-business-center.svg"
                alt="Saudi Business Center"
                className="h-5 md:h-6 object-contain dark:brightness-0 dark:invert"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/90 dark:bg-zinc-100 rounded-lg px-2.5 py-1.5 max-w-full">
                <img
                  src="https://englishom.com/images/svgs/mada.svg"
                  alt="Mada"
                  className="h-4 md:h-6 object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <img
                  src="https://englishom.com/images/svgs/apple-pay.svg"
                  alt="Apple Pay"
                  className="h-4 md:h-6 object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <img
                  src="https://englishom.com/images/svgs/visa.svg"
                  alt="Visa"
                  className="h-5 md:h-7 object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <img
                  src="https://englishom.com/images/svgs/mastercard.svg"
                  alt="Mastercard"
                  className="h-4 md:h-6 object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <img
                  src="https://englishom.com/tamara.svg"
                  alt="Tamara"
                  className="h-5 md:h-8 aspect-[710/280] object-contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
              <img
                src="https://englishom.com/images/maroof_new.jpg"
                alt="Maroof"
                className="h-5 md:h-6 object-contain rounded-full border border-white/20"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-12 text-right">
            {/* Copyright */}
            <div className="text-[#CCCCCC] text-sm">
              <p>
                © 2026 جميع الحقوق محفوظة لـ | مشغل بواسطة{" "}
                <a
                  href="https://englishom.com"
                  className="text-[#F5BB41] hover:underline font-bold"
                >
                  إنجليشوم
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-2.5 flex-wrap justify-center md:flex-nowrap md:justify-end pb-16 md:pb-0" dir="ltr">
              {/* YouTube */}
              <a href="https://www.youtube.com/@Englishom_sa" target="_blank" rel="noopener noreferrer" title="YouTube" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF0000] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* X */}
              <a href="https://x.com/Englishom_sa" target="_blank" rel="noopener noreferrer" title="X" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0f1419] border border-slate-700 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@englishom_sa" target="_blank" rel="noopener noreferrer" title="TikTok" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#111111] border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.39.67-4.8 2.37-6.49 1.69-1.69 4.13-2.52 6.51-2.22v4.14c-1.16-.16-2.37.15-3.23.86-.88.7-1.38 1.78-1.35 2.9.01 1.05.51 2.05 1.34 2.7.83.66 1.94.94 2.99.76 1.05-.16 2.02-.79 2.56-1.7.53-.89.77-1.95.74-2.99V.02z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/966542577250" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#25D366] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
              {/* Telegram */}
              <a href="https://t.me/Englishom_sa" target="_blank" rel="noopener noreferrer" title="Telegram" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#229ED9] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.28-1.49 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.76-5.2c.25-.22-.05-.35-.39-.13l-7.12 4.48-3.07-.96c-.67-.21-.68-.67.14-.99l12.01-4.63c.56-.21 1.05.13.83.99z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/englishom_sa?igsh=cTB6czYwYXR2Zmty" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* Snapchat */}
              <a href="https://www.snapchat.com/add/englishom_sa" target="_blank" rel="noopener noreferrer" title="Snapchat" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFFA37] border border-[#e5e01b] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M21.026 8.186C20.06 6.969 18.466 6 16.012 6c-2.103.02-6.308 1.184-6.308 5.674 0 .655.052 1.534.097 2.18a1.589 1.589 0 01-.223-.094l-.015-.007c-.184-.089-.464-.223-.853-.223-.394 0-.774.154-1.056.382-.28.227-.52.576-.52.998 0 .528.296.879.644 1.104.308.2.697.327 1.005.428l.03.01c.33.108.572.19.739.294.13.08.149.132.151.18a1.753 1.753 0 01-.105.248 5.967 5.967 0 01-.36.597c-.303.445-.67.902-.946 1.167a6.09 6.09 0 01-1.182.843c-.23.128-.456.234-.658.307a1.464 1.464 0 01-.456.104.696.696 0 00-.168.022 1.326 1.326 0 00-.393.178c-.181.123-.435.37-.435.758 0 .203.048.375.13.524.072.13.165.23.218.287l.008.008.015.016c.293.316.78.535 1.25.686.406.13.859.226 1.3.284l.02.093.002.01c.028.132.065.305.12.465.05.151.143.375.333.534.241.202.557.223.763.222.221 0 .48-.032.725-.062l.02-.002a8.944 8.944 0 011.08-.085c.682 0 1.12.285 1.805.754l.005.003c.238.162.504.344.806.523 1.012.598 1.835.593 2.3.59a13.491 13.491 0 01.176 0c.467.003 1.311.008 2.324-.59.302-.18.568-.36.806-.523l.005-.003c.686-.469 1.123-.754 1.805-.754.373 0 .734.043 1.08.085l.02.002c.245.03.503.061.725.062.206 0 .522-.02.763-.222.19-.16.283-.383.334-.534.054-.16.09-.333.119-.464l.002-.011.02-.093a7.607 7.607 0 001.3-.284c.47-.15.957-.37 1.25-.686l.015-.016.008-.008c.053-.057.146-.156.218-.287.082-.149.13-.32.13-.524 0-.389-.254-.635-.436-.758a1.327 1.327 0 00-.392-.178.696.696 0 00-.168-.022c-.095 0-.247-.029-.456-.104a4.664 4.664 0 01-.658-.307 6.091 6.091 0 01-1.182-.843c-.275-.265-.643-.722-.945-1.167a5.955 5.955 0 01-.362-.597 1.762 1.762 0 01-.104-.248c.002-.048.022-.1.151-.18.167-.104.409-.186.738-.295l.03-.01c.309-.1.698-.228 1.006-.427.348-.225.645-.576.645-1.103 0-.422-.24-.772-.52-.999a1.711 1.711 0 00-1.057-.382c-.39 0-.67.134-.853.223l-.015.007c-.104.05-.17.079-.223.094.045-.646.097-1.525.097-2.18 0-.89-.323-2.295-1.27-3.488z" fill="#fff" /></svg>
              </a>
              {/* Blog */}
              <a href="https://englishom.com/blog" target="_blank" rel="noopener noreferrer" title="Blog" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#3c0c0e] border border-[#2e0709] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm8 8h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V7h6v2z"/></svg>
              </a>
              {/* Threads */}
              <a href="https://www.threads.net/@englishom_sa" target="_blank" rel="noopener noreferrer" title="Threads" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#000000] border border-slate-700 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 192 192"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1JunPviNMg/" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>

          </div>
        </div>
      </footer>

      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#222222] text-white border border-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-right"
            dir="rtl"
          >
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-[#F5BB41] transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 mt-2 text-[#F5BB41]">
              إخلاء المسؤولية
            </h3>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify mb-2 whitespace-pre-line">
              جميع المقالات والمحتويات المنشورة في هذه المدونة هي لأغراض تثقيفية وتعليمية عامة، وتُمثل وجهات نظر كتابها بناءً على الأبحاث والمصادر المتاحة. المسميات الوظيفية والتحريرية المذكورة (مثل: خبير، مستشار، أخصائي) تُستخدم في سياقها التحريري لإبراز زاوية الطرح وتخصص المقال، ولا تُعد بديلة عن الاستشارات المهنية والرسمية المباشرة. لا تتحمل المنصة أي مسؤولية قانونية عن قرار يُتخذ بناءً على المعلومات الواردة في الموقع.
            </p>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#F5BB41] text-black hover:opacity-95 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
