import { toast } from "sonner";

export class TestError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "TestError";
  }
}

export const ErrorCodes = {
  // Test Flow Errors
  TEST_NOT_STARTED: "TEST_NOT_STARTED",
  INVALID_STAGE: "INVALID_STAGE",
  MISSING_ANSWERS: "MISSING_ANSWERS",
  SUBMISSION_FAILED: "SUBMISSION_FAILED",
  TIMEOUT: "TIMEOUT",

  // Audio Errors
  MICROPHONE_NOT_AVAILABLE: "MICROPHONE_NOT_AVAILABLE",
  AUDIO_RECORDING_FAILED: "AUDIO_RECORDING_FAILED",
  AUDIO_PLAYBACK_FAILED: "AUDIO_PLAYBACK_FAILED",
  PERMISSION_DENIED: "PERMISSION_DENIED",

  // Network Errors
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // Validation Errors
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Database Errors
  QUESTION_NOT_FOUND: "QUESTION_NOT_FOUND",
  RESULT_NOT_FOUND: "RESULT_NOT_FOUND",
} as const;

interface ErrorMessage {
  title: string;
  message: string;
  action?: string;
}

const errorMessages: Record<string, ErrorMessage> = {
  [ErrorCodes.TEST_NOT_STARTED]: {
    title: "Test Not Started",
    message: "Please start the test first before answering questions.",
  },
  [ErrorCodes.INVALID_STAGE]: {
    title: "Invalid Stage",
    message: "The current test stage is invalid. Please refresh and try again.",
  },
  [ErrorCodes.MISSING_ANSWERS]: {
    title: "Incomplete Answers",
    message: "Please answer all questions before proceeding to the next stage.",
  },
  [ErrorCodes.SUBMISSION_FAILED]: {
    title: "Submission Failed",
    message: "Failed to submit your test. Please check your connection and try again.",
    action: "Retry",
  },
  [ErrorCodes.TIMEOUT]: {
    title: "Time's Up",
    message: "The time limit for this question has been reached. Moving to the next question.",
  },
  [ErrorCodes.MICROPHONE_NOT_AVAILABLE]: {
    title: "Microphone Not Available",
    message: "Your microphone is not available. Please check your device settings.",
    action: "Check Permissions",
  },
  [ErrorCodes.AUDIO_RECORDING_FAILED]: {
    title: "Recording Failed",
    message: "Failed to record audio. Please try again.",
    action: "Retry",
  },
  [ErrorCodes.AUDIO_PLAYBACK_FAILED]: {
    title: "Playback Failed",
    message: "Failed to play audio. Please check your speakers and try again.",
    action: "Retry",
  },
  [ErrorCodes.PERMISSION_DENIED]: {
    title: "Permission Denied",
    message: "Please allow microphone access to complete the Vocal Challenge stage.",
    action: "Grant Permission",
  },
  [ErrorCodes.NETWORK_ERROR]: {
    title: "Network Error",
    message: "Unable to connect to the server. Please check your internet connection.",
    action: "Retry",
  },
  [ErrorCodes.SERVER_ERROR]: {
    title: "Server Error",
    message: "An error occurred on the server. Please try again later.",
  },
  [ErrorCodes.TIMEOUT_ERROR]: {
    title: "Connection Timeout",
    message: "The request took too long. Please check your connection and try again.",
    action: "Retry",
  },
  [ErrorCodes.INVALID_INPUT]: {
    title: "Invalid Input",
    message: "The input provided is invalid. Please check and try again.",
  },
  [ErrorCodes.MISSING_REQUIRED_FIELD]: {
    title: "Missing Information",
    message: "Please fill in all required fields.",
  },
  [ErrorCodes.QUESTION_NOT_FOUND]: {
    title: "Question Not Found",
    message: "The question could not be loaded. Please refresh and try again.",
  },
  [ErrorCodes.RESULT_NOT_FOUND]: {
    title: "Result Not Found",
    message: "Your test result could not be found. Please contact support.",
  },
};

export function handleError(error: unknown, context?: string): void {
  let errorCode: string;
  let errorMessage: string;

  if (error instanceof TestError) {
    errorCode = error.code;
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorCode = "UNKNOWN_ERROR";
    errorMessage = error.message;
  } else {
    errorCode = "UNKNOWN_ERROR";
    errorMessage = "An unexpected error occurred";
  }

  const displayMessage = errorMessages[errorCode] || {
    title: "Error",
    message: errorMessage,
  };

  console.error(`[${context || "App"}] Error (${errorCode}):`, error);

  toast.error(displayMessage.title, {
    description: displayMessage.message,
    action: displayMessage.action
      ? {
          label: displayMessage.action,
          onClick: () => window.location.reload(),
        }
      : undefined,
  });
}

export function handleMicrophoneError(error: DOMException | Error): void {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      handleError(
        new TestError(
          ErrorCodes.PERMISSION_DENIED,
          "Microphone permission was denied"
        ),
        "Microphone"
      );
    } else if (error.name === "NotFoundError") {
      handleError(
        new TestError(
          ErrorCodes.MICROPHONE_NOT_AVAILABLE,
          "No microphone device found"
        ),
        "Microphone"
      );
    } else {
      handleError(
        new TestError(
          ErrorCodes.AUDIO_RECORDING_FAILED,
          error.message
        ),
        "Microphone"
      );
    }
  } else {
    handleError(error, "Microphone");
  }
}

export function validateTestInput(data: {
  studentName?: string;
  studentEmail?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.studentName || data.studentName.trim().length === 0) {
    errors.push("Student name is required");
  }

  if (!data.studentEmail || data.studentEmail.trim().length === 0) {
    errors.push("Student email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.studentEmail)) {
    errors.push("Please enter a valid email address");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
