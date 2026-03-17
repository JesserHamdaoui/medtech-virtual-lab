export interface Lab {
  id: string;
  title: string;
  labTitle?: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  phetUrl: string;
  tags?: string[];
  thumbnail?: string;
  objectives: string[];
  questions?: LabQuestion[];
  metadata?: {
    sourceTitle?: string;
    course?: string;
    level?: string;
    institution?: string;
    term?: string;
    academicYear?: string;
  };
}

export interface LabCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type QuestionType = "text" | "table" | "plot";

export interface LabQuestion {
  id: string;
  labId: string;
  type: QuestionType;
  title: string;
  description: string;
  instruction: string;
  sourceLabel?: string;
  responseFormat?: string;
  section?: string;
  points: number;
  required: boolean;
  // For table questions
  tableConfig?: {
    columns: string[];
    rows: number;
    headers: string[];
  };
  // For plot questions
  plotConfig?: {
    xLabel: string;
    yLabel: string;
    title: string;
    gridSize?: number;
  };
}

export interface StudentAnswer {
  id: string;
  studentId: string;
  labId: string;
  questionId: string;
  type: QuestionType;
  submittedAt: Date;
  // For text answers
  textAnswer?: string;
  // For table answers
  tableAnswer?: {
    data: (string | number)[][];
  };
  // For plot answers
  plotAnswer?: {
    points: { x: number; y: number }[];
    curves?: { points: { x: number; y: number }[]; label: string }[];
  };
  // Inline grade (set when faculty grades an individual answer)
  grade?: Grade;
}

export interface Grade {
  id: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  labId?: string;
  questionId?: string;
  answerId: string;
  facultyId?: string;
  points: number;
  maxPoints: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt: Date;
}

export interface LabSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  labId: string;
  submittedAt: Date;
  answers: StudentAnswer[];
  grades: Grade[];
  totalPoints: number;
  maxPoints: number;
  status: "submitted" | "graded" | "partial";
  isGraded?: boolean;
}

// Course Management Types
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  facultyId: string;
  students: string[]; // Student IDs
  labIds: string[]; // Assigned lab IDs
  createdAt: Date;
  isActive: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[]; // Course IDs
  isVerified: boolean;
  otpCode?: string;
  otpExpiry?: Date;
  createdAt: Date;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: Date;
  isActive: boolean;
}

export interface OTPRequest {
  id: string;
  email: string;
  otpCode: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}
