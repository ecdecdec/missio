export type AlertChannel = 'email' | 'sms' | 'telegram' | 'whatsapp' | 'in_app';

export type ProgramType =
  | 'scholarship'
  | 'grant'
  | 'exchange'
  | 'internship'
  | 'bootcamp'
  | 'mentorship'
  | 'contest';

export type ProgramStatus = 'draft' | 'published' | 'archived';

export interface ProgramBase {
  id: string;
  title: string;
  slug: string;
  type: ProgramType;
  status: ProgramStatus;
  organizationName: string;
  country: string;
  city?: string;
  language: string;
  applicationUrl?: string;
  websiteUrl?: string;
  description: string;
  benefits?: string[];
  requirements?: string[];
  tags?: string[];
  deadline?: string; // ISO date
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface ScholarshipProgram extends ProgramBase {
  type: 'scholarship';
  fundingAmount?: number;
  currency?: string;
  coversTuition?: boolean;
  coversStipend?: boolean;
}

export interface GrantProgram extends ProgramBase {
  type: 'grant';
  maxGrantAmount?: number;
  currency?: string;
  eligibleFields?: string[];
}

export interface ExchangeProgram extends ProgramBase {
  type: 'exchange';
  hostUniversity?: string;
  durationMonths?: number;
}

export interface InternshipProgram extends ProgramBase {
  type: 'internship';
  companyName?: string;
  isPaid?: boolean;
  durationMonths?: number;
}

export interface BootcampProgram extends ProgramBase {
  type: 'bootcamp';
  modality?: 'online' | 'offline' | 'hybrid';
  durationWeeks?: number;
}

export interface MentorshipProgram extends ProgramBase {
  type: 'mentorship';
  mentorCount?: number;
  cohortSize?: number;
}

export interface ContestProgram extends ProgramBase {
  type: 'contest';
  field?: string;
  prizePoolAmount?: number;
  currency?: string;
}

export type Program =
  | ScholarshipProgram
  | GrantProgram
  | ExchangeProgram
  | InternshipProgram
  | BootcampProgram
  | MentorshipProgram
  | ContestProgram;

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'waitlisted';

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  city?: string;
  region?: string;
  country: string;
  dateOfBirth?: string; // ISO date
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  schoolName?: string;
  grade?: string;
  graduationYear?: number;
  gpa?: number;
  fieldsOfInterest?: string[];
  languages?: { code: string; level: 'basic' | 'intermediate' | 'advanced' | 'native' }[];
  achievements?: string[];
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  preferredAlertChannels?: AlertChannel[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Match {
  id: string;
  studentId: string;
  programId: string;
  score: number; // 0-100
  reasons?: string[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Application {
  id: string;
  studentId: string;
  programId: string;
  status: ApplicationStatus;
  submittedAt?: string; // ISO date
  lastStatusChangeAt?: string; // ISO date
  matchId?: string;
  notes?: string;
  externalApplicationId?: string;
  attachments?: {
    id: string;
    type: 'cv' | 'motivation_letter' | 'transcript' | 'portfolio' | 'other';
    url: string;
    uploadedAt: string; // ISO date
  }[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}