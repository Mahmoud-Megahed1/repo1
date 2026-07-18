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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-right">
            {/* Brand */}
            <div className="space-y-4">
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

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">روابط سريعة</h4>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li><a href="https://englishom.com" className="hover:text-[#F5BB41] transition-colors duration-300">الرئيسية</a></li>
                <li><a href="https://englishom.com/our-vision" className="hover:text-[#F5BB41] transition-colors duration-300">من نحن</a></li>
                <li><a href="#faq" className="hover:text-[#F5BB41] transition-colors duration-300">الأسئلة الشائعة</a></li>
                <li><a href="https://englishom.com/blog/" className="hover:text-[#F5BB41] transition-colors duration-300">المدونة</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">المصادر</h4>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li><a href="https://englishom.com/terms-and-conditions" className="hover:text-[#F5BB41] transition-colors duration-300">الشروط والأحكام</a></li>
                <li><a href="https://englishom.com/privacy-policy" className="hover:text-[#F5BB41] transition-colors duration-300">سياسة الخصوصية</a></li>
                <li><a href="https://englishom.com/terms-and-conditions" className="hover:text-[#F5BB41] transition-colors duration-300">سياسة الاسترجاع</a></li>
                <li><a href="https://englishom.com" className="hover:text-[#F5BB41] transition-colors duration-300">شهادة معروف</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">تواصل معنا</h4>
              <div className="space-y-3 text-[#CCCCCC]">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#F5BB41] flex-shrink-0" />
                  <a href="mailto:support@englishom.com" className="hover:text-[#F5BB41] transition-colors">
                    support@englishom.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#F5BB41] flex-shrink-0" />
                  <a
                    href="https://wa.me/966542577250?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+%D8%A8%D9%83+%D9%81%D9%8A+Englishom+-+%D9%87%D9%84+%D9%84%D8%AF%D9%8A%D9%83+%D8%A3%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA%D8%9F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F5BB41] transition-colors"
                  >
                    واتساب
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F5BB41] mt-1 flex-shrink-0" />
                  <span>المملكة العربية السعودية، الرياض</span>
                </div>
              </div>
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
            <div className="flex gap-3 sm:gap-4 flex-wrap justify-center md:justify-end pr-0 md:pr-24 pb-16 md:pb-0" dir="ltr">
              <a href="https://www.youtube.com/@EglishHOM" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#FF0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://x.com/englishom28264" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]" title="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.829 6.694h-3.328l7.691-8.794-8.182-10.706h6.564l4.853 6.361 5.286-6.361zM16.17 18.933h1.829L5.896 5.009H4.013l12.157 13.924z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@englishom1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-black hover:bg-[#25F4EE] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(37,244,238,0.4)]" title="TikTok">
                <Music2 className="w-5 h-5" />
              </a>
              <a href="https://wa.me/966542577250?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+%D8%A8%D9%83+%D9%81%D9%8A+Englishom+-+%D9%87%D9%84+%D9%84%D8%AF%D9%8A%D9%83+%D8%A3%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA%D8%9F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]" title="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://t.me/+xlzna51reL1hNzc0" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#0088cc] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,136,204,0.4)]" title="Telegram">
                <Send className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/englishom1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-[#f09433] hover:to-[#e6683c] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(230,104,60,0.4)]" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.snapchat.com/add/englishom25" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-black hover:bg-[#FFFC00] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,252,0,0.4)]" title="Snapchat">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.917-.236.14-.065.27-.1.399-.1.243 0 .442.09.573.262.168.225.176.522.028.822a1.547 1.547 0 0 1-.06.107c-.219.37-.737.597-1.464.67a3.414 3.414 0 0 0-.18.018c-.064.006-.148.015-.21.02a.612.612 0 0 0-.367.17c-.094.118-.13.283-.106.49.184 1.455.975 2.86 2.357 4.187a.85.85 0 0 1 .19.285c.072.213-.038.425-.28.567-1.074.634-2.235.77-3.3.88a32.7 32.7 0 0 0-.205.024c-.118.015-.177.045-.21.09-.066.087-.049.245-.032.378.011.09.024.18.024.27 0 .37-.225.638-.636.638a3.43 3.43 0 0 1-.637-.076 5.307 5.307 0 0 0-1.098-.137c-.416 0-.816.064-1.155.195a4.338 4.338 0 0 0-.774.448c-.564.39-1.201.832-2.2.832-.026 0-.053 0-.077-.002h-.06c-1-.002-1.637-.444-2.2-.833a4.357 4.357 0 0 0-.775-.45 3.496 3.496 0 0 0-1.154-.193c-.39 0-.772.043-1.098.137a3.426 3.426 0 0 1-.638.076c-.412 0-.636-.268-.636-.638 0-.09.012-.18.024-.27.017-.134.034-.29-.032-.378-.034-.046-.093-.076-.21-.09a34.12 34.12 0 0 0-.206-.025c-1.064-.11-2.225-.245-3.3-.88-.24-.14-.35-.353-.277-.566a.85.85 0 0 1 .19-.286c1.381-1.326 2.173-2.732 2.357-4.187.024-.207-.012-.372-.106-.49a.614.614 0 0 0-.366-.17 1.766 1.766 0 0 0-.21-.02 3.592 3.592 0 0 1-.18-.018c-.727-.073-1.245-.3-1.465-.67a1.508 1.508 0 0 1-.059-.107c-.148-.3-.14-.597.028-.822.13-.172.33-.262.573-.262.13 0 .26.035.398.1.258.116.618.22.917.236.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.3-4.847C7.648 1.069 11.004.793 11.994.793h.212z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/19wWacNacT/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
