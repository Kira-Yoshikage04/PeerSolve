export enum Role {
  STUDENT = 'student',
  // FIX: Add the ADMIN role to the enum.
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  points: number;
  branch: Branch;
  accessGranted: boolean;
}

export enum AcademicYear {
  FIRST = '1st Year',
  SECOND = '2nd Year',
  THIRD = '3rd Year',
  FOURTH = '4th Year',
}

export enum Subject {
  COMPUTER_SCIENCE = 'Computer Science',
  MATHEMATICS = 'Mathematics',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  ELECTRICAL_ENGINEERING = 'Electrical Engineering',
}

export enum Branch {
  CSE = 'Computer Science & Engg.',
  ECE = 'Electronics & Communication',
  CE = 'Chemical Engineering',
  EEE = 'Electrical & Electronics',
  CIVIL = 'Civil Engineering',
  MECH = 'Mechanical Engineering',
}

export interface Doubt {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  subject: Subject;
  year: AcademicYear;
  branch: Branch;
  createdAt: string;
  isResolved: boolean;
}

export interface Answer {
  id: string;
  doubtId: string;
  text: string;
  videoUrl?: string;
  audioUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  feedback?: Feedback;
}

export interface Feedback {
  rating: number; // 1-5
  review: string;
}