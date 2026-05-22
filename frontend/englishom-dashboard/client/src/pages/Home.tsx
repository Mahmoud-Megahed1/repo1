import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import EnglishomLogo from "@/components/EnglishomLogo";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg shadow-lg shadow-cyan-500/50">
                <EnglishomLogo size="md" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">ENGLISHOM</h1>
                <p className="text-xs text-cyan-400/70">إنجليشوم</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              لوحة البيانات الحية
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              مرحباً بك في Englishom
            </span>
          </h2>
          <p className="text-cyan-400/70 text-xl mb-8">
            منصة تعليم اللغة الإنجليزية الحديثة مع تتبع حي للمسجلين من جميع أنحاء العالم
          </p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 text-lg px-8 py-6"
          >
            اكتشف لوحة البيانات الحية
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
