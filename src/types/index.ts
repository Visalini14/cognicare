export type UserRole = 'patient' | 'caregiver';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  patientId?: string;   // For caregivers: the linked patient UID
  patientName?: string; // Cache of linked patient name
}

export type GameType = 'memory-match' | 'pattern-recall' | 'recognition-quiz' | 'family-recognition';

export interface GameResult {
  id: string;
  userId: string;
  userName?: string;
  gameType: GameType;
  score: number;
  accuracy: number; // Percentage (0 - 100)
  correctAnswers: number;
  totalQuestions: number;
  responseTime: number; // Average response time in seconds
  difficultyLevel: number; // 1 to 5
  inputMethod?: 'voice' | 'button'; // Optional input method tracking
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  caregiverId: string;
  patientId?: string;
  name: string;
  relationship: string;
  photoUrl: string; // Primary photo URL
  photos?: string[]; // 2-5 reference photos
  embeddings?: number[][]; // Extracted face feature embedding vectors
  notes?: string;
  createdAt: string;
}

export interface AdaptiveDifficultyState {
  currentLevel: number; // 1 - 5
  consecutiveCorrect: number;
  totalPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  avgResponseTime: number;
  lastUpdated: string;
}

export interface RecognitionQuestion {
  id: string;
  imageUrl?: string;
  iconSymbol: string;
  question: string;
  correctAnswer: string;
  options: string[];
  category: 'object' | 'routine' | 'food' | 'activity';
  difficultyTier: number; // 1 - 5
}
