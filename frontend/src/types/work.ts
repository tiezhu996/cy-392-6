export type CraftType = "knit" | "wood" | "pottery" | "leather" | "paper" | "embroidery" | "other";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Author {
  id: string;
  name: string;
  bio: string;
  followed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CraftWork {
  id: string;
  title: string;
  type: CraftType;
  difficulty: Difficulty;
  materials: string[];
  durationHours: number;
  images: string[];
  description: string;
  steps: string[];
  tutorialUrl?: string;
  author: Author;
  likes: number;
  collected: boolean;
  comments: Comment[];
  createdAt: string;
}

export function migrateWork(raw: Record<string, unknown>): CraftWork {
  return {
    id: raw.id as string,
    title: raw.title as string,
    type: raw.type as CraftType,
    difficulty: raw.difficulty as Difficulty,
    materials: (raw.materials as string[]) ?? [],
    durationHours: (raw.durationHours as number) ?? 0,
    images: (raw.images as string[]) ?? [],
    description: (raw.description as string) ?? "",
    steps: (raw.steps as string[]) ?? [],
    tutorialUrl: raw.tutorialUrl as string | undefined,
    author: raw.author as Author,
    likes: (raw.likes as number) ?? 0,
    collected: (raw.collected as boolean) ?? false,
    comments: Array.isArray(raw.comments) ? (raw.comments as Comment[]) : [],
    createdAt: (raw.createdAt as string) ?? new Date().toISOString()
  };
}
