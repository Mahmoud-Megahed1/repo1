/**
 * Accessibility utilities for ARIA labels, keyboard navigation, and screen reader support
 */

export const A11yLabels = {
  // Navigation
  navigation: "Main navigation",
  languageToggle: "Toggle language between English and Arabic",
  logout: "Logout from your account",

  // Test Interface
  testContainer: "English placement test",
  progressBar: "Test progress indicator",
  stageIndicator: (stage: number, total: number) =>
    `Stage ${stage} of ${total}`,
  questionNumber: (current: number, total: number) =>
    `Question ${current} of ${total}`,
  timer: (seconds: number) => `Time remaining: ${seconds} seconds`,

  // Buttons
  startTest: "Start the placement test",
  nextQuestion: "Move to the next question",
  nextStage: "Proceed to the next stage",
  submitAnswer: "Submit your answer",
  completeTest: "Complete and submit the test",
  playAudio: "Play audio for this question",
  startRecording: "Start recording your voice",
  stopRecording: "Stop recording",
  retryAudio: "Replay audio",

  // Form Fields
  fullName: "Enter your full name",
  email: "Enter your email address",
  answerInput: "Enter your answer",

  // Results
  resultsContainer: "Your test results",
  scoreDisplay: (score: number) => `Your score: ${score}%`,
  levelBadge: (level: string) => `Your proficiency level: ${level}`,
  feedbackMessage: "Personalized feedback message",
  recommendation: "Recommendation for your learning path",

  // Admin
  adminDashboard: "Admin dashboard",
  questionBank: "Question bank management",
  studentResults: "Student test results",
  addQuestion: "Add a new question",
  editQuestion: "Edit this question",
  deleteQuestion: "Delete this question",
};

export const KeyboardShortcuts = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
};

export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  callbacks: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
): void {
  switch (event.key) {
    case KeyboardShortcuts.ENTER:
      if (callbacks.onEnter) {
        event.preventDefault();
        callbacks.onEnter();
      }
      break;
    case KeyboardShortcuts.SPACE:
      if (callbacks.onSpace) {
        event.preventDefault();
        callbacks.onSpace();
      }
      break;
    case KeyboardShortcuts.ESCAPE:
      if (callbacks.onEscape) {
        event.preventDefault();
        callbacks.onEscape();
      }
      break;
    case KeyboardShortcuts.ARROW_UP:
      if (callbacks.onArrowUp) {
        event.preventDefault();
        callbacks.onArrowUp();
      }
      break;
    case KeyboardShortcuts.ARROW_DOWN:
      if (callbacks.onArrowDown) {
        event.preventDefault();
        callbacks.onArrowDown();
      }
      break;
    case KeyboardShortcuts.ARROW_LEFT:
      if (callbacks.onArrowLeft) {
        event.preventDefault();
        callbacks.onArrowLeft();
      }
      break;
    case KeyboardShortcuts.ARROW_RIGHT:
      if (callbacks.onArrowRight) {
        event.preventDefault();
        callbacks.onArrowRight();
      }
      break;
  }
}

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function focusElement(element: HTMLElement | null): void {
  if (element) {
    element.focus();
    // Announce focus change to screen readers
    announceToScreenReader(`Focused on ${element.getAttribute("aria-label") || element.textContent}`);
  }
}

export const AriaRoles = {
  BUTTON: "button",
  LINK: "link",
  HEADING: "heading",
  REGION: "region",
  ALERT: "alert",
  PROGRESSBAR: "progressbar",
  TABLIST: "tablist",
  TAB: "tab",
  TABPANEL: "tabpanel",
  LISTBOX: "listbox",
  OPTION: "option",
  DIALOG: "dialog",
  FORM: "form",
};

export interface A11yProps {
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaHidden?: boolean;
  ariaLive?: "polite" | "assertive" | "off";
  ariaAtomic?: boolean;
  tabIndex?: number;
}

export function getA11yProps(label: string, role?: string): A11yProps {
  return {
    role,
    ariaLabel: label,
    tabIndex: 0,
  };
}
