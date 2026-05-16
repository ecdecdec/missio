export type ProgramType =
  | "exchange"
  | "grant"
  | "internship"
  | "olympiad"
  | "summer_school"
  | "scholarship"
  | "competition"
  | "summer_camp"
  | "leadership"
  | "research";

export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "not_required";

export type ProgramDifficulty = "easy" | "medium" | "hard";

export interface Program {
  id: string;
  name: string;
  nameRu: string;
  organization: string;
  type: ProgramType;
  country: string;
  countryCode: string;
  deadline: string;
  gradeMin: number;
  gradeMax: number;
  englishLevel: EnglishLevel;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationUrl: string;
  tags: string[];
  isPopular: boolean;
  isFeatured: boolean;
  difficulty: ProgramDifficulty;
}

export interface StudentProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  schoolType?: string;
  schoolName?: string;
  city?: string;
  grade?: string;
  gpa?: number;
  gpaScale?: string;
  subjects?: string[];
  englishLevel?: string;
  englishTestType?: string;
  englishTestScore?: number;
  satScore?: number;
  otherLanguages?: { language: string; level: string }[];
  olympiads?: { subject: string; level: string; place: string; year: number }[];
  researchProjects?: { title: string; field: string }[];
  leadershipPositions?: string[];
  volunteerHours?: number;
  volunteerOrgs?: string[];
  workExperience?: string[];
  awards?: string[];
  publications?: string[];
  passportStatus?: string;
  hasMotivationLetters?: boolean;
  hasRecommendationLetters?: boolean;
  recommendationFrom?: string[];
  needsFinancialAid?: boolean;
  visaRejections?: boolean;
  achievements?: string[];
  targetTypes?: string[];
  targetCountries?: string[];
  studyFields?: string[];
  timeline?: string;
  endGoal?: string;
  whatsapp?: string;
  telegram?: string;
  alertFrequency?: string;
  minMatchScore?: number;
}
