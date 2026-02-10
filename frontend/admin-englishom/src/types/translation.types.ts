import { LessonsId } from './global.types';
import { LevelId } from './user.types';

export type TranslationSchema = {
  LandingPage: LandingPage;
  SignUpPage: SignUpPage;
  LoginPage: LoginPage;
  OTPPage: OTPPage;
  AdminPage: AdminPage;
  LevelsPage: LevelsPage;
  ReadPage: ReadPage;
  PicturesPage: PicturesPage;
  PhrasalVerbsPage: PhrasalVerbsPage;
  IdiomsPage: IdiomsPage;
  DailyTestPage: DailyTestPage;
  Global: Global;
  Admin: Admin;
};

type LabeledField = {
  label: string;
  placeholder: string;
};

type LandingPage = {
  navbar: Navbar;
  hero: Hero;
  howItWorks: HowItWorks;
  features: Features;
  testimonials: Testimonials;
  fqa: Fqa;
  pricing: Pricing;
  footer: {
    copyRight: string;
  };
};

type Navbar = {
  links: Links;
  login: string;
  signUp: string;
};

type Links = {
  howItWorks: string;
  features: string;
  testimonials: string;
  faq: string;
  pricing: string;
};

type Hero = {
  title: string;
  description: string;
  ctaButton: string;
  students: string;
  learningLevels: string;
  learningDays: string;
  skillsPerDay: string;
  kUnit: string;
};

type HowItWorks = {
  title: string;
  description: string;
  levelsTitle: string;
  dailyActivities: string;
  dailyJourney: DailyJourney;
};

type DailyJourney = {
  title: string;
  description: string;
  learnMore: string;
};

type Features = {
  title: string;
  description: string;
  features: Array<{ title: string; description: string }>;
};

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
  stars: string;
};
type Testimonials = {
  title: string;
  description: string;
  testimonials: Testimonial[];
};

type Fqa = {
  title: string;
  description: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

type Pricing = {
  title: string;
  description: string;
  pricingDetails: PricingDetails;
  ctaButton: string;
};

type PricingDetails = {
  title: string;
  description: string;
  price: string;
  perLevel: string;
  features: string[];
};

type FormPage = {
  title: string;
  formTitle: string;
  submitButton: string;
};

type SignUpPage = FormPage & {
  inputs: {
    firstName: LabeledField;
    lastName: LabeledField;
    email: LabeledField;
    password: LabeledField;
  };
  loginButton: string;
  alreadyHaveAccount: string;
};

type LoginPage = FormPage & {
  inputs: {
    email: LabeledField;
    password: LabeledField;
  };
  signUpButton: string;
  haveNotAccount: string;
  invalidCredentials: string;
};

type OTPPage = FormPage & {
  inputs: {
    otp: {
      label: string;
    };
  };
  optInvalid: string;
  resendSuccess: string;
  resendError: string;
  resendCode: string;
  dontReceiveCode: string;
  optSendSuccessfully: string;
};

type AdminPage = {
  title: string;
  description: string;
  welcome: string;
  accessDenied: string;
  notAuthorized: string;
  goHome: string;
};

type LevelsPage = {
  title: string;
  description: string;
  price: string;
  startLearning: string;
  unlock: string;
  accessDenied: { title: string; description: string };
  levels: Record<
    LevelId,
    {
      title: string;
      description: string;
      level: string;
    }
  >;
};

type ReadPage = {
  reading: string;
  listening: string;
  haveTasks: string;
};

type PicturesPage = {
  title: string;
  haveTasks: string;
  otherWords: string;
};

type PhrasalVerbsPage = {
  title: string;
  definition: string;
  explanations: string[];
};

type IdiomsPage = {
  title: string;
  definition: string;
  explanations: string[];
};

type DailyTestPage = {
  title: string;
  description: string;
  pictureDescription: string;
  audioDescription: string;
  grade: string;
};



type Global = {
  appName: string;
  welcome: string;
  description: string;
  loading: string;
  level: string;
  all: string;
  completed: string;
  inComplete: string;
  day: string;
  minute: string;
  continue: string;
  result: string;
  next: string;
  prev: string;
  definition: string;
  useCases: string;
  examples: string;
  noTasks: string;
  nextTasks: string;
  words: string;
  record: string;
  stop: string;
  review: string;
  markAsComplete: string;
  or: string;
  logout: string;
  sidebar: {
    home: string;
    levels: string;
    admin: string;
    lessons: Record<LessonsId, string>;
  };
  formErrors: {
    required: string;
    min: string;
    max: string;
    invalidEmail: string;
    emailExists: string;
  };

};

type Admin = {
  themes: {
    title: string;
    add: string;
    edit: string;
    delete: string;
    list: string;
  };
};
