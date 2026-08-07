import { useState, useMemo, useEffect } from 'react';
import { Rocket, Zap, Target, TrendingUp, AlertTriangle, Clock, BarChart3, Calendar, Timer, Award, ArrowUp, ArrowDown, Minus, GraduationCap, Loader2, LogIn, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const TOTAL_COURSE_DAYS = 50;
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const API_BASE = 'https://api.englishom.com/api';

const SOCIAL_LINKS = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Englishom_sa",
    bg: "bg-[#FF0000]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/Englishom_sa",
    bg: "bg-[#0f1419] border border-slate-700",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@englishom_sa",
    bg: "bg-[#111111] border border-slate-800",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.39.67-4.8 2.37-6.49 1.69-1.69 4.13-2.52 6.51-2.22v4.14c-1.16-.16-2.37.15-3.23.86-.88.7-1.38 1.78-1.35 2.9.01 1.05.51 2.05 1.34 2.7.83.66 1.94.94 2.99.76 1.05-.16 2.02-.79 2.56-1.7.53-.89.77-1.95.74-2.99V.02z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/966542577250",
    bg: "bg-[#25D366]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/Englishom_sa",
    bg: "bg-[#229ED9]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.28-1.49 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.76-5.2c.25-.22-.05-.35-.39-.13l-7.12 4.48-3.07-.96c-.67-.21-.68-.67.14-.99l12.01-4.63c.56-.21 1.05.13.83.99z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/englishom_sa?igsh=cTB6czYwYXR2Zmty",
    bg: "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://www.snapchat.com/add/englishom_sa",
    bg: "bg-[#FFFA37] border border-[#e5e01b]",
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.026 8.186C20.06 6.969 18.466 6 16.012 6c-2.103.02-6.308 1.184-6.308 5.674 0 .655.052 1.534.097 2.18a1.589 1.589 0 01-.223-.094l-.015-.007c-.184-.089-.464-.223-.853-.223-.394 0-.774.154-1.056.382-.28.227-.52.576-.52.998 0 .528.296.879.644 1.104.308.2.697.327 1.005.428l.03.01c.33.108.572.19.739.294.13.08.149.132.151.18a1.753 1.753 0 01-.105.248 5.967 5.967 0 01-.36.597c-.303.445-.67.902-.946 1.167a6.09 6.09 0 01-1.182.843c-.23.128-.456.234-.658.307a1.464 1.464 0 01-.456.104.696.696 0 00-.168.022 1.326 1.326 0 00-.393.178c-.181.123-.435.37-.435.758 0 .203.048.375.13.524.072.13.165.23.218.287l.008.008.015.016c.293.316.78.535 1.25.686.406.13.859.226 1.3.284l.02.093.002.01c.028.132.065.305.12.465.05.151.143.375.333.534.241.202.557.223.763.222.221 0 .48-.032.725-.062l.02-.002a8.944 8.944 0 011.08-.085c.682 0 1.12.285 1.805.754l.005.003c.238.162.504.344.806.523 1.012.598 1.835.593 2.3.59a13.491 13.491 0 01.176 0c.467.003 1.311.008 2.324-.59.302-.18.568-.36.806-.523l.005-.003c.686-.469 1.123-.754 1.805-.754.373 0 .734.043 1.08.085l.02.002c.245.03.503.061.725.062.206 0 .522-.02.763-.222.19-.16.283-.383.334-.534.054-.16.09-.333.119-.464l.002-.011.02-.093a7.607 7.607 0 001.3-.284c.47-.15.957-.37 1.25-.686l.015-.016.008-.008c.053-.057.146-.156.218-.287.082-.149.13-.32.13-.524 0-.389-.254-.635-.436-.758a1.327 1.327 0 00-.392-.178.696.696 0 00-.168-.022c-.095 0-.247-.029-.456-.104a4.664 4.664 0 01-.658-.307 6.091 6.091 0 01-1.182-.843c-.275-.265-.643-.722-.945-1.167a5.955 5.955 0 01-.362-.597 1.762 1.762 0 01-.104-.248c.002-.048.022-.1.151-.18.167-.104.409-.186.738-.295l.03-.01c.309-.1.698-.228 1.006-.427.348-.225.645-.576.645-1.103 0-.422-.24-.772-.52-.999a1.711 1.711 0 00-1.057-.382c-.39 0-.67.134-.853.223l-.015.007c-.104.05-.17.079-.223.094.045-.646.097-1.525.097-2.18 0-.89-.323-2.295-1.27-3.488zm-9.243.587c-.8 1.002-1.075 2.193-1.075 2.9 0 .657.055 1.568.102 2.222a.865.865 0 01-.218.67c-.192.204-.453.27-.686.27-.337 0-.593-.123-.757-.202l-.019-.009c-.183-.088-.279-.128-.42-.128a.687.687 0 00-.41.155c-.126.103-.163.202-.163.26 0 .116.043.2.2.301.187.12.453.211.8.325l.031.01c.29.095.647.212.93.388.317.198.61.516.61 1.005 0 .128-.036.252-.07.345a2.663 2.663 0 01-.139.316c-.11.214-.258.456-.42.697-.324.477-.735.994-1.077 1.323-.345.332-.865.705-1.39.997-.265.147-.541.278-.808.374a2.568 2.568 0 01-.742.164.392.392 0 00-.051.028l-.005.003a.14.14 0 00.003.015.075.075 0 00.008.019c.01.017.024.037.086.103l.016.017c.111.12.385.275.82.414.412.132.901.227 1.363.271a.586.586 0 01.42.244c.059.08.092.165.111.22.038.11.066.243.088.349l.004.016c.03.143.057.267.092.37a.753.753 0 00.033.083.877.877 0 00.105.005c.212 0 .425-.032.635-.058.337-.04.753-.09 1.194-.09 1.023 0 1.698.46 2.35.906l.037.025c.24.165.483.33.755.49.766.453 1.349.45 1.775.448h.174c.43.002 1.034.005 1.8-.447.271-.161.513-.326.754-.49l.037-.026c.652-.445 1.327-.906 2.35-.906.44 0 .857.05 1.194.09l.01.002c.272.032.471.056.625.056a.876.876 0 00.105-.005.764.764 0 00.033-.084c.035-.102.062-.226.092-.37l.004-.015c.022-.106.05-.24.088-.348a.846.846 0 01.11-.22.586.586 0 01.421-.245c.462-.044.95-.14 1.364-.271.434-.139.708-.294.819-.414l.016-.017a.604.604 0 00.087-.103.075.075 0 00.008-.019.13.13 0 00.003-.015l-.005-.003a.294.294 0 00-.051-.028 2.568 2.568 0 01-.742-.164 5.676 5.676 0 01-.808-.374c-.525-.292-1.045-.665-1.39-.997-.342-.33-.753-.846-1.076-1.323a6.893 6.893 0 01-.421-.697 2.663 2.663 0 01-.14-.316 1.051 1.051 0 01-.069-.345c0-.49.293-.807.61-1.005.283-.176.64-.293.93-.388l.03-.01c.348-.114.614-.204.8-.325.158-.102.2-.185.2-.301 0-.058-.036-.157-.162-.26a.687.687 0 00-.41-.155c-.141 0-.237.04-.42.128l-.019.01c-.164.078-.42.201-.757.201-.233 0-.494-.066-.686-.27a.865.865 0 01-.218-.67c.047-.654.102-1.565.102-2.221 0-.71-.27-1.9-1.065-2.903-.776-.978-2.075-1.805-4.215-1.805-2.14 0-3.446.827-4.229 1.807z" fill="#000"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.783 8.773c-.801 1.003-1.076 2.193-1.076 2.9 0 .657.056 1.568.103 2.222a.866.866 0 01-.219.67c-.191.204-.452.27-.686.27-.336 0-.593-.123-.756-.202l-.02-.009c-.182-.088-.278-.128-.42-.128a.687.687 0 00-.41.155c-.125.103-.162.203-.162.26 0 .116.043.2.2.301.187.12.452.211.8.325l.03.01c.29.095.648.212.93.388.317.198.61.516.61 1.005 0 .128-.035.252-.068.345a2.68 2.68 0 01-.14.316c-.11.214-.258.456-.421.697-.323.477-.735.994-1.076 1.323-.346.332-.865.705-1.39.997-.265.147-.542.278-.808.374a2.562 2.562 0 01-.742.164.326.326 0 00-.051.028l-.005.003c0 .007.002.012.003.015a.075.075 0 00.007.019c.01.017.025.037.087.103l.016.017c.111.12.385.275.819.414.413.132.902.227 1.364.271a.586.586 0 01.42.244c.058.08.091.165.11.22.038.11.067.243.089.349l.003.016c.03.144.058.267.092.37a.76.76 0 00.034.084.905.905 0 00.105.004c.212 0 .425-.032.635-.057.337-.041.753-.091 1.194-.091 1.023 0 1.698.46 2.35.906l.036.025c.242.165.483.33.755.49.766.454 1.35.45 1.775.448a13.148 13.148 0 01.175 0c.43.002 1.033.005 1.8-.447.271-.161.513-.326.754-.49l.037-.026c.652-.445 1.327-.906 2.35-.906.44 0 .857.05 1.194.09l.01.002c.272.032.471.056.625.056a.904.904 0 00.105-.004.755.755 0 00.033-.085c.035-.102.061-.225.092-.37l.003-.015c.023-.106.051-.24.088-.348a.847.847 0 01.111-.22.586.586 0 01.42-.245c.463-.044.951-.14 1.364-.271.434-.139.708-.294.82-.414l.016-.017a.604.604 0 00.086-.103.075.075 0 00.008-.019l.003-.015-.005-.003a.294.294 0 00-.052-.028 2.562 2.562 0 01-.742-.164 5.654 5.654 0 01-.807-.374c-.525-.292-1.045-.665-1.39-.997-.342-.33-.753-.846-1.077-1.323a6.913 6.913 0 01-.42-.697 2.696 2.696 0 01-.14-.316 1.054 1.054 0 01-.069-.345c0-.49.293-.807.61-1.005.283-.176.64-.293.93-.388l.03-.01c.348-.114.613-.204.8-.325.158-.102.2-.185.2-.301 0-.057-.036-.157-.162-.26a.687.687 0 00-.41-.155c-.141 0-.238.04-.42.128l-.02.01c-.163.078-.42.201-.756.201-.233 0-.494-.066-.686-.27a.865.865 0 01-.219-.67 35.1 35.1 0 00.103-2.221c0-.71-.27-1.9-1.065-2.902-.776-.98-2.075-1.806-4.216-1.806-2.14 0-3.445.827-4.228 1.807z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1JunPviNMg/",
    bg: "bg-[#1877F2]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Blog",
    href: "https://englishom.com/blog",
    bg: "bg-[#800000] border border-[#600000]",
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#800000" />
        <path d="M16 5l2.8 10.5h-5.6L16 5z" fill="#D4AF37"/>
        <path d="M14.2 15.5h3.6v1.8a1 1 0 01-1 1h-1.6a1 1 0 01-1-1v-1.8z" fill="#D4AF37"/>
        <circle cx="16" cy="15" r="0.7" fill="#800000"/>
        <path d="M6 21c2.5-1.5 6-1.8 10 .5 4-2.3 7.5-2 10-.5v4.5c-2.5-1.5-6-1.8-10 .5-4-2.3-7.5-2-10-.5V21z" fill="#D4AF37"/>
        <path d="M16 21.5v5" stroke="#800000" strokeWidth="0.5"/>
      </svg>
    ),
  },
];

type LevelDetails = {
  levelName: string;
  currentDay: number;
  isCompleted: boolean;
  purchaseDate: string;
  expiresAt: string;
  daysLeft: number;
  isExpired: boolean;
};

type LoadingState = 'loading' | 'loaded' | 'no-auth' | 'no-course' | 'error';

export default function App() {
  const [planDays, setPlanDays] = useState(0);
  const [studentDays, setStudentDays] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [activeLevelName, setActiveLevelName] = useState<string>('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingState('no-auth');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setLoadingState('no-auth');
            return;
          }
          throw new Error('Failed to fetch');
        }

        const data = await res.json();
        const levels: LevelDetails[] = data.levelsDetails || [];

        if (levels.length === 0) {
          setLoadingState('no-course');
          return;
        }

        // Find the active (non-completed, non-expired) level
        const activeLevel = levels.find(l => !l.isCompleted && !l.isExpired) || levels[0];

        if (activeLevel) {
          // studentDays = completed days (currentDay - 1, since currentDay is the NEXT day to study)
          const completed = Math.max(0, activeLevel.currentDay - 1);
          setStudentDays(completed);
          setActiveLevelName(activeLevel.levelName);

          // planDays = calendar days elapsed since purchase (expected 1 lesson/day)
          if (activeLevel.purchaseDate) {
            const purchase = new Date(activeLevel.purchaseDate);
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
            setPlanDays(Math.min(Math.max(1, elapsed), TOTAL_COURSE_DAYS));
          }

          setLoadingState('loaded');
        } else {
          setLoadingState('no-course');
        }
      } catch {
        setLoadingState('error');
      }
    };

    fetchProgress();
  }, []);

  const velocity = useMemo(() => {
    if (planDays === 0) return 1;
    return Number((studentDays / planDays).toFixed(2));
  }, [studentDays, planDays]);

  const expectedRemainingDays = useMemo(() => {
    if (velocity <= 0) return TOTAL_COURSE_DAYS;
    const remainingDaysAtCurrentPace = (TOTAL_COURSE_DAYS - studentDays) / velocity;
    return Math.ceil(remainingDaysAtCurrentPace);
  }, [studentDays, velocity]);

  const totalExpectedDays = studentDays + expectedRemainingDays;
  const timeSavedDays = Math.max(0, TOTAL_COURSE_DAYS - totalExpectedDays);
  
  const progressValue = Math.min((studentDays / TOTAL_COURSE_DAYS) * 100, 100);
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progressValue / 100) * CIRCLE_CIRCUMFERENCE;

  const statusInfo = useMemo(() => {
    if (velocity >= 2) return { icon: <Zap className="text-yellow-400" size={28}/>, title: 'أداء خيالي!', msg: `أنت تسير بسرعة ${velocity}x — ستنهي الكورس في ${totalExpectedDays} يوم فقط!`, color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30' };
    if (velocity > 1.5) return { icon: <Rocket className="text-blue-400" size={28}/>, title: 'متفوق جداً!', msg: `أنت تسير بسرعة ${velocity}x من الخطة. استمر في هذا الزخم!`, color: 'from-blue-500/20 to-sky-500/10', border: 'border-blue-500/30' };
    if (velocity > 1) return { icon: <TrendingUp className="text-emerald-400" size={28}/>, title: 'متفوق!', msg: `أنت تسير بسرعة ${velocity}x — تقدم رائع!`, color: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/30' };
    if (velocity === 1) return { icon: <Target className="text-purple-400" size={28}/>, title: 'على المسار الصحيح', msg: 'أنت تسير حسب الخطة تماماً. التزامك هو مفتاح النجاح!', color: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30' };
    if (velocity > 0.5) return { icon: <Clock className="text-orange-400" size={28}/>, title: 'متأخر قليلاً', msg: `أنت تسير بسرعة ${velocity}x — يمكنك زيادة السرعة قليلاً!`, color: 'from-orange-500/20 to-amber-500/10', border: 'border-orange-500/30' };
    return { icon: <AlertTriangle className="text-red-400" size={28}/>, title: 'تحتاج للتسارع', msg: `أنت تسير ببطء (${velocity}x). حاول زيادة وتيرتك!`, color: 'from-red-500/20 to-rose-500/10', border: 'border-red-500/30' };
  }, [velocity, totalExpectedDays]);

  const difference = studentDays - planDays;

  const getDifferenceIcon = () => {
    if (difference > 0) return <ArrowUp className="w-5 h-5 text-emerald-400" />;
    if (difference < 0) return <ArrowDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://englishom.com" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img
                src="https://englishom.com/logo.jpeg"
                alt="Englishom"
                className="h-10 w-auto rounded-md"
              />
              <span className="font-bold text-lg text-white">Englishom</span>
            </a>
            <span className="text-slate-500 text-sm">|</span>
            <span className="text-slate-400 text-sm font-medium">لوحة أداء الطالب</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="https://englishom.com" className="text-sm text-slate-400 hover:text-white transition-colors">الرئيسية</a>
            <a href="https://englishom.com/test" className="text-sm text-slate-400 hover:text-white transition-colors">اختبار المستوى</a>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            لوحة أداء الطالب
          </h1>
        </div>
        <p className="text-slate-400 text-base mr-11">تابع تقدمك وسرعة إنجازك في الكورس</p>
      </div>

      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="flex-1 flex items-center justify-center py-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm">جاري تحميل بيانات التقدم...</p>
          </motion.div>
        </div>
      )}

      {/* Not Authenticated */}
      {loadingState === 'no-auth' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">سجل دخولك أولاً</h2>
            <p className="text-slate-400 text-sm leading-relaxed">يجب تسجيل الدخول لعرض بيانات تقدمك الفعلية في الكورس.</p>
            <a
              href="https://englishom.com/ar/login"
              onClick={() => { localStorage.setItem('redirectUrl', window.location.pathname + window.location.search + window.location.hash); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </a>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">حدث خطأ</h2>
            <p className="text-slate-400 text-sm leading-relaxed">لم نتمكن من تحميل بيانات تقدمك. تأكد من اتصالك بالإنترنت.</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">
              إعادة المحاولة
            </button>
          </motion.div>
        </div>
      )}

      {/* No Course State */}
      {loadingState === 'no-course' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">لا يوجد اشتراك نشط</h2>
            <p className="text-slate-400 text-sm leading-relaxed">أنت الآن في فترة التجربة المجانية ولم تقم بالاشتراك في أي مستوى حتى الآن. اشترك الآن لتبدأ في تتبع تقدمك بدقة واحترافية!</p>
            <a
              href="https://englishom.com/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Target className="w-4 h-4" />
              تصفح خطط الاشتراك
            </a>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      {loadingState === 'loaded' && <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* Speedometer Section */}
          <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="circular-progress absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={CIRCLE_RADIUS} className="progress-bg" />
                <circle 
                  cx="100" cy="100" r={CIRCLE_RADIUS} 
                  className="progress-fill" 
                  style={{ strokeDashoffset }} 
                />
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className="text-6xl font-extrabold text-white">
                  {velocity}x
                </span>
                <span className="text-slate-300 text-sm mt-2.5 font-bold tracking-wider uppercase">سرعة الإنجاز</span>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3.5">
              <div className="flex justify-between items-center text-base px-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  إنجاز الطالب
                </span>
                <span className="font-extrabold text-white text-lg">{studentDays} <span className="text-xs text-slate-400 font-normal">يوم</span></span>
              </div>
              <div className="flex justify-between items-center text-base px-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  الخطة
                </span>
                <span className="font-extrabold text-white text-lg">{planDays} <span className="text-xs text-slate-400 font-normal">يوم</span></span>
              </div>
              <div className="h-px bg-white/10 mx-1"></div>
              <div className="flex justify-between items-center text-base px-1">
                <span className="text-slate-200 font-semibold">التقدم الكلي</span>
                <span className="font-black text-2xl text-emerald-400">{Math.round(progressValue)}%</span>
              </div>
            </div>
          </motion.section>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-cyan p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-extrabold text-white">إنجاز الطالب</h3>
                  </div>
                  <p className="text-sm text-cyan-300/70">الأيام المنجزة</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5 z-10">
                  <span className="text-4xl font-extrabold text-cyan-400">{studentDays}</span>
                  <span className="text-base font-bold text-cyan-400/80">يوم</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-red p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Calendar className="w-5 h-5 text-red-400" />
                    <h3 className="text-base font-extrabold text-white">الخطة المتوقعة</h3>
                  </div>
                  <p className="text-sm text-red-300/70">اليوم الحالي</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5 z-10">
                  <span className="text-4xl font-extrabold text-red-400">{planDays}</span>
                  <span className="text-base font-bold text-red-400/80">يوم</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-purple p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Award className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-extrabold text-white">التقدم الكلي</h3>
                  </div>
                  <p className="text-sm text-purple-300/70">نسبة الإكمال</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5 z-10">
                  <span className="text-4xl font-extrabold text-purple-400">{Math.round(progressValue)}</span>
                  <span className="text-base font-bold text-purple-400/80">%</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-green p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    {getDifferenceIcon()}
                    <h3 className="text-base font-extrabold text-white">الفرق</h3>
                  </div>
                  <p className="text-sm text-emerald-300/70">التفوق على الخطة</p>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5 z-10">
                  <span className="text-4xl font-extrabold text-emerald-400">{difference > 0 ? `+${difference}` : difference}</span>
                  <span className="text-base font-bold text-emerald-400/80">يوم</span>
                </div>
              </motion.div>
            </div>

            {/* Status Message */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={`glass-card p-6 flex items-start gap-4 bg-gradient-to-l ${statusInfo.color} ${statusInfo.border}`}>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                {statusInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{statusInfo.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{statusInfo.msg}</p>
              </div>
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Timeline */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">التوقعات الزمنية</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-slate-300 font-medium">الانتهاء المتوقع</span>
                    <span className="font-extrabold text-xl text-white">{expectedRemainingDays} <span className="text-sm font-normal text-slate-500">يوم متبقي</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-slate-300 font-medium">الأيام المتبقية من الكورس</span>
                    <span className="font-extrabold text-xl text-white">{Math.max(0, TOTAL_COURSE_DAYS - studentDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-slate-300 font-medium">التوفير الزمني</span>
                    <span className="font-extrabold text-xl text-emerald-400">{timeSavedDays} <span className="text-sm font-normal text-slate-500">أيام</span></span>
                  </div>
                </div>
              </div>

              {/* Live Progress Data */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">سرعة الدراسة مقابل الخطة</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-base font-bold text-slate-200">إنجاز الطالب (أيام)</label>
                      <span className="text-base font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded">{studentDays}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((studentDays / TOTAL_COURSE_DAYS) * 100, 100)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-base font-bold text-slate-200">الخطة المتوقعة (أيام)</label>
                      <span className="text-base font-extrabold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded">{planDays}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((planDays / TOTAL_COURSE_DAYS) * 100, 100)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                  {activeLevelName && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">المستوى الحالي</span>
                        <span className="text-sm font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded">
                          {activeLevelName.replace('LEVEL_', '')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-md mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" dir="rtl">
          {/* Banner Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-3 justify-start">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                إنجلشوم | لوحة أداء الطالب
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                "البداية الذكية لرحلتك اللغوية. صممنا هذه الأداة التفاعلية لتشخيص مهاراتك الحالية بدقة، لتنطلق في ممارستك الذاتية من نقطة تناسبك تماماً."
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-9 h-9 rounded-xl ${social.bg} flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg`}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 pt-6 border-t border-white/5">
            <p>© 2026 إنجلشوم (EnglishOM). جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6">
              <a href="https://englishom.com" className="hover:text-slate-300 transition-colors">الرئيسية</a>
              <a href="https://englishom.com/test" className="hover:text-slate-300 transition-colors">اختبار المستوى</a>
              <a href="https://englishom.com/ar/contact" className="hover:text-slate-300 transition-colors">تواصل معنا</a>
              <button
                type="button"
                onClick={() => setShowDisclaimer(true)}
                className="hover:text-slate-300 transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                إخلاء المسؤولية
              </button>
            </div>
          </div>
        </div>
      </footer>

      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-right text-white"
            dir="rtl"
          >
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 mt-2 text-right">
              إخلاء المسؤولية
            </h3>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed text-justify mb-2 whitespace-pre-line">
              هذا المؤشر مصمم لقراءة مدى تمكنك الحالي ومساعدتك في رصد تقدمك وتوجيه خطواتك القادمة داخل المنصة، وهو قراءة تقنية تقديرية وليست معياراً نهائياً أو حاسماً؛ فالهدف هو دعم ممارستك الذاتية ومنحك رؤية واضحة ومستمرة لتطورك.
            </p>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all"
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
