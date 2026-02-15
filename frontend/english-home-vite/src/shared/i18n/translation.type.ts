import type { LessonId, LevelId } from '@shared/types/entities';

export type TranslationType = {
  Landing: {
    header: {
      navigation: {
        features: string;
        levels: string;
        reviews: string;
        ourVision: string;
        faq: string;
        about: string;
        contact: string;
      };
      cta: {
        login: string;
      };
    };
    hero: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
      watchDemo: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: {
        interactive: {
          title: string;
          description: string;
        };
        speaking: {
          title: string;
          description: string;
        };
        progress: {
          title: string;
          description: string;
        };
        levels: {
          title: string;
          description: string;
        };
        daily: {
          title: string;
          description: string;
        };
        certificate: {
          title: string;
          description: string;
        };
      };
    };
    levels: {
      title: string;
      subtitle: string;
    } & Record<
      LevelId,
      {
        features: string[];
      }
    >;
    testimonials: {
      title: string;
      subtitle: string;
      items: {
        sarah: {
          name: string;
          role: string;
          content: string;
        };
        mohammed: {
          name: string;
          role: string;
          content: string;
        };
        fatima: {
          name: string;
          role: string;
          content: string;
        };
      };
    };
    fqa: {
      title: string;
      description: string;
      questions: Array<{ question: string; answer: string }>;
    };
    cta: {
      title: string;
      subtitle: string;
      description: string;
      primary: string;
      secondary: string;
    };
    contact: {
      title: string;
      subtitle: string;
      emailsSection: {
        title: string;
        description: string;
      };
      emails: Record<
        'support' | 'info' | 'billing' | 'admin',
        {
          type: string;
          description: string;
        }
      >;
      socialSection: {
        title: string;
        description: string;
      };
      social: {
        facebook: string;
        instagram: string;
        snapchat: string;
        telegram: string;
        whatsapp: string;
        tiktok: string;
        twitter: string;
        youtube: string;
      };
      additionalInfo: {
        title: string;
        responseTime: string;
        languages: string;
        preferredEmail: string;
      };
    };
    stats: {
      students: {
        number: string;
        label: string;
      };
      lessons: {
        number: string;
        label: string;
      };
      success: {
        number: string;
        label: string;
      };
      countries: {
        number: string;
        label: string;
      };
    };
    about: {
      title: string;
      subtitle: string;
      sections: {
        story: {
          title: string;
          description: string;
        };
        team: {
          title: string;
          description: string;
        };
        quality: {
          title: string;
          description: string;
        };
        join: {
          title: string;
          description: string;
        };
      };
    };
    ourVision: {
      title: string;
      subtitle: string;
      sections: {
        vision: {
          title: string;
          description: string;
        };
        goal: {
          title: string;
          description: string;
        };
        methodology: {
          title: string;
          subtitle: string;
          description: string;
          ourStructureApproach: string;
          points: {
            wordsPerLevel: {
              title: string;
              description: string;
            };
            dailyWords: {
              title: string;
              description: string;
            };
            pronunciation: {
              title: string;
              description: string;
            };
            speaking: {
              title: string;
              description: string;
            };
            scenarios: {
              title: string;
              description: string;
            };
          };
        };
        mission: {
          title: string;
          description: string;
          missionTitle: string;
          missionDescription: string;
          valuesTitle: string;
          values: {
            results: {
              title: string;
              description: string;
            };
            practice: {
              title: string;
              description: string;
            };
            support: {
              title: string;
              description: string;
            };
            clarity: {
              title: string;
              description: string;
            };
            innovation: {
              title: string;
              description: string;
            };
          };
        };
        story: {
          title: string;
          description: string;
        };
        team: {
          title: string;
          description: string;
        };
        commitment: {
          title: string;
          description: string;
          features: {
            words: {
              title: string;
              description: string;
            };
            images: {
              title: string;
              description: string;
            };
            translation: {
              title: string;
              description: string;
            };
            sentences: {
              title: string;
              description: string;
            };
            audio: {
              title: string;
              description: string;
            };
            recording: {
              title: string;
              description: string;
            };
            writing: {
              title: string;
              description: string;
            };
            grammar: {
              title: string;
              description: string;
            };
            idiom: {
              title: string;
              description: string;
            };
            phrasal: {
              title: string;
              description: string;
            };
            mission: {
              title: string;
              description: string;
            };
          };
          success: {
            title: string;
            points: {
              perseverance: {
                title: string;
                description: string;
              };
              repetition: {
                title: string;
                description: string;
              };
              test: {
                title: string;
                description: string;
              };
              monitoring: {
                title: string;
                description: string;
              };
            };
          };
        };
        join: {
          title: string;
          description: string;
        };
      };
    };
    footer: {
      brand: {
        description: string;
      };
      quickLinks: {
        title: string;
        features: string;
        levels: string;
        reviews: string;
        ourVision: string;
        about: string;
        contact: string;
      };
      learning: {
        title: string;
        startLearning: string;
        login: string;
      };
      support: {
        title: string;
        helpCenter: string;
        contactUs: string;
        userGuide: string;
      };
      legal: {
        title: string;
        termsAndConditions: string;
        privacyPolicy: string;
      };
      copyright: string;
      year: string;
    };
  };
  TermsAndConditions: {
    title: string;
    lastUpdated: string;
    sections: {
      acceptance: {
        title: string;
        content: {
          scope: string;
          agreement: string;
          nature: string;
        };
      };
      intellectualProperty: {
        title: string;
        content: {
          ownership: string;
          prohibition: string;
          personalUse: string;
        };
      };
      registration: {
        title: string;
        content: {
          personalAccount: string;
          pricing: string;
          paymentMethods: string;
          refundPolicy: string;
        };
      };
      userResponsibility: {
        title: string;
        content: {
          recordingAccuracy: string;
          userBehavior: string;
          dataAndSecurity: string;
        };
      };
      disclaimer: {
        title: string;
        content: {
          disclaimerStatement: string;
          results: string;
          liability: string;
        };
      };
      termination: {
        title: string;
        content: {
          terminationRights: string;
          accountDeletion: string;
        };
      };
    };
    contactInfo: {
      title: string;
      publishDate: string;
    };
  };
  PrivacyPolicy: {
    title: string;
    intro: string;
    lastUpdated: string;
    sections: {
      dataCollection: {
        title: string;
        intro: string;
        table: {
          headers: {
            type: string;
            examples: string;
            purpose: string;
          };
          rows: {
            registration: {
              type: string;
              examples: string;
              purpose: string;
            };
            payment: {
              type: string;
              examples: string;
              purpose: string;
            };
            performance: {
              type: string;
              examples: string;
              purpose: string;
            };
            audioRecordings: {
              type: string;
              examples: string;
              purpose: string;
            };
            usage: {
              type: string;
              examples: string;
              purpose: string;
            };
          };
        };
      };
      dataUsage: {
        title: string;
        intro: string;
        purposes: {
          serviceProvision: string;
          support: string;
          payment: string;
          noHumanIntervention: string;
          exclusiveUse: string;
          ownership: string;
          noSharing: string;
        };
        audioCommitment: string;
      };
      dataProtection: {
        title: string;
        security: string;
        paymentEncryption: string;
        passwordHashing: string;
      };
      dataSharing: {
        title: string;
        intro: string;
        exceptions: {
          serviceProviders: string;
          legalRequirements: string;
        };
      };
      userRights: {
        title: string;
        intro: string;
        rights: {
          access: string;
          modification: string;
          deletion: string;
        };
      };
      cookies: {
        title: string;
        description: string;
      };
    };
  };
  App: {
    dashboard: {
      welcome: string;
      defaultName: string;
      subtitle: string;
      stats: {
        totalProgress: string;
        levelsCompleted: string;
        daysCompleted: string;
        daysSubtitle: string;
        unlockedLevels: string;
        levelsSubtitle: string;
        certificates: string;
        certificatesSubtitle: string;
      };
      currentLevel: {
        title: string;
        description: string;
        dayProgress: string;
        dayCount: string;
        continue: string;
      };
      getStarted: {
        title: string;
        description: string;
        cta: string;
      };
      quickAccess: {
        title: string;
        description: string;
      };
      achievements: {
        title: string;
        completed: string;
        empty: string;
      };
      levels: {
        title: string;
        completed: string;
        dayProgress: string;
        locked: string;
        viewAll: string;
      };
    };
  };
  Auth: {
    'login-form': {
      title: string;
      description: string;
      'login-button': string;
      'forgot-password': string;
      'no-account': string;
      'register-link': string;
      'login-with-facebook': string;
      'login-with-google': string;
    };
    'signup-form': {
      title: string;
      description: string;
      'first-name-label': string;
      'first-name-placeholder': string;
      'last-name-label': string;
      'last-name-placeholder': string;
      'signup-button': string;
      'has-account': string;
      'login-link': string;
      'signup-with-facebook': string;
      'signup-with-google': string;
      'accept-terms': string;
    };
    'otp-form': {
      title: string;
      description: string;
      optSendSuccessfully: string;
      enterCode: string;
      dontReceiveCode: string;
      resendCode: string;
      'verify-button': string;
      haveNotAccount: string;
      signUpButton: string;
      label: string;
      invalidOtp: string;
    };

    'forget-password-form': {
      emailForm: {
        title: string;
        description: string;
      };
      otpForm: {
        title: string;
        description: string;
      };
      resetPasswordForm: {
        title: string;
        description: string;
        confirmPasswordLabel: string;
        resetPassword: string;
        passwordDoesNotMatch: string;
      };
      continue: string;
      backToLogin: string;
      back: string;
    };

    'or-continue': string;
  };
  Global: {
    englishom: string;
    chooseYourLevel: string;
    loading: string;
    notFound: string;
    forSixtyDays: string;
    expired: string;
    renew: string;
    completed: string;
    renewSubscription: string;
    expiredOn: string;
    expiresAt: string;
    validUntil: string;
    daysLeft: string;
    notFoundDescription: string;
    lockedLevel: {
      title: string;
      description: string;
      cta: string;
    };
    goToHome: string;
    account: string;
    logout: string;
    startLearning: string;
    unlock: string;
    processing: string;
    price: string;
    light: string;
    dark: string;
    second: string;
    seconds: string;
    reset: string;
    writing: {
      title: string;
      description: string;
      checkAnswers: string;
      correct: string;
      incorrect: string;
    };
    todayLesson: {
      instructions: string;
      practiceSpeaking: string;
      practiceSentences: string;
      lessonAudio: string;
      recordYourself: string;
      recording: string;
      startRecording: string;
    };
    idioms: {
      definitionCard: {
        title: string;
        description: string;
      };
      examplesCard: {
        title: string;
        description: string;
        exampleInSituation: string;
      };
      useCasesCard: {
        title: string;
        description: string;
      };
    };
    phrasalVerbs: {
      definitionCard: {
        title: string;
        description: string;
      };
      examplesCard: {
        title: string;
        description: string;
        exampleInSituation: string;
      };
      useCasesCard: {
        title: string;
        description: string;
      };
    };
    dayAccessError: {
      title: string;
      description: string;
      goToCurrentDay: string;
    };
    'form-fields': {
      'required-error': string;
      'min-error': string;
      'max-error': string;
      email: {
        label: string;
        placeholder: string;
        error: string;
        'required-error': string;
        alreadyExists: string;
      };
      password: {
        label: string;
        placeholder: string;
        'min-error': string;
        'required-error': string;
        'max-error': string;
      };
    };
    overallProgress: string;
    complete: string;
    'learning-journey-50-days': string;
    day: string;
    review: string;
    start: string;
    min: string;
    totalDays: string;
    dailyTime: string;
    progress: string;
    minPerDay: string;
    sidebarItems: {
      home: string;
      levels: string;
    } & Record<LessonId, string>;
    level: string;
    definition: string;
    definitions: string;
    markAsCompleted: string;
    markAsUncompleted: string;
    show: string;
    hide: string;
    comingSoon: string;
    comingSoonMessage: string;
    transcript: string;
    tryAgain: string;
    errorMessages: Record<ErrorsKeys, { title: string; message: string }>;
    pictureVocabulary: {
      title: string;
      description: string;
    };
    english: string;
    arabic: string;
    play: string;
    pause: string;
    hideExamples: string;
    showExamples: string;
    vocabulary: string;
    words: string;
    notes: string;
    examples: string;
    useCases: string;
    questionAndAnswer: string;
    certification: string;
    generating: string;
    accountOverview: string;
    accountDescription: string;
    personalInformation: string;
    yourResults: string;
    whatYouSaid: string;
    tip: {
      title: string;
      description: string;
    };
    similarity: string;
    analyzingYourSpeech: string;
    verified: string;
    notVerified: string;
    status: string;
    congratulations: string;
    youHaveCompletedDays: string;
    getCombinedAudio: string;
    generatingAudio: string;
    active: string;
    inactive: string;
    lastActivity: string;
    memberSince: string;
    learningProgress: string;
    progressDescription: string;
    levelsCompleted: string;
    daysCompleted: string;
    completedSuccessfully: string;
    passed: string;
    keepPracticing: string;
    speaking: {
      title: string;
      subDescription: string;
      description: string;
    };
    dailyTest: {
      showResults: string;
      listenToAudio: string;
      lookAtImage: string;
      finish: string;
      submitAnswer: string;
      testCard: {
        title: string;
        description: string;
        correct: string;
        inCorrect: string;
        total: string;
        retake: string;
        review: string;
      };
    };
    showAll: string;
    showLess: string;
    question: string;
    questions: string;
    answer: string;
    next: string;
    prev: string;
    listenToAudio: string;
    clickToPlay: string;
    of: string;
    phrasalVerb: string;
    back: string;
    example: string;
    otherPhrasalVerbs: string;
    suspendedAccount: {
      title: string;
      subtitle: string;
      suspensionDetails: string;
      email: string;
      suspensionDate: string;
      endsOn: string;
      reason: string;
      timeRemaining: string;
      timeRemainingDescription: string;
      day: string;
      days: string;
      duringSuspension: string;
      cannotAccessMaterials: string;
      progressSafe: string;
      communityUnavailable: string;
      fullAccessRestored: string;
      appealProcess: string;
      appealDescription: string;
      appealProvide: string;
      appealRequirements: {
        accountEmail: string;
        detailedExplanation: string;
        supportingEvidence: string;
        acknowledgmentGuidelines: string;
      };
      contactSupport: string;
      emailSupport: string;
      phoneSupport: string;
      footerMessage: string;
      additionalInfo: string;
      phoneNumberCopied: string;
      appealSubject: string;
    };
    blockedAccount: {
      title: string;
      subtitle: string;
      accountDetails: string;
      email: string;
      blockDate: string;
      reason: string;
      nextSteps: string;
      nextStepsDescription: string;
      contactSupportProvide: string;
      contactSupportRequirements: {
        accountEmail: string;
        blockNoticeDate: string;
        relevantContext: string;
      };
      contactSupport: string;
      emailSupport: string;
      phoneSupport: string;
      footerMessage: string;
      additionalInfo: string;
      phoneNumberCopied: string;
      appealSubject: string;
    };
  };

  UserGuide: {
    title: string;
    subtitle: string;
    philosophy: {
      title: string;
      description: string;
      selfLearning: {
        title: string;
        description: string;
      };
      challenge: {
        title: string;
        description: string;
      };
      foundation: {
        title: string;
        description: string;
      };
    };
    gettingStarted: {
      title: string;
      description: string;
      features: {
        dashboard: {
          title: string;
          description: string;
          action: string;
        };
        words: {
          title: string;
          description: string;
          action: string;
        };
        progress: {
          title: string;
          description: string;
          action: string;
        };
      };
    };
    dailyTasks: {
      title: string;
      duration: string;
      description: string;
      tip: string;
      tasks: Array<{
        title: string;
        description: string;
        tip: string;
      }>;
    };
    quickFaq: {
      title: string;
      questions: Array<{
        question: string;
        answer: string;
      }>;
    };
    success: {
      title: string;
      description: string;
      cta: string;
    };
    support: {
      note: string;
    };
  };
  ShareProgress: {
    title: string;
    subtitle: string;
    currentProgress: string;
    remainingDuration: string;
    daysToComplete: string;
    days: string;
    completed: string;
    cta: string;
    startLearning: string;
    ofDays: string;
    student: string;
    currentLevel: string;
    englishomStudent: string;
  };
};

type ErrorsKeys =
  | 'networkError'
  | 'badRequest'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'tooManyRequests'
  | 'badGateway'
  | 'unavailableService'
  | 'gatewayTimeout'
  | 'internalServerError'
  | 'timeout'
  | 'microphoneDenied'
  | 'unexpectedError';

export type { ErrorsKeys };
