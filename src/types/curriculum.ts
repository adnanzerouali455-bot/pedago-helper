export interface Chapter {
  id: string;
  slug: string;
  titleFr: string;
  titleAr: string;
  chapterNumber: number;
  estimatedDurationMin: number;
  keywords: string[];
  animations?: string[];
}

export interface Unit {
  id: string;
  titleFr: string;
  titleAr: string;
  unitNumber: number;
  semester?: 1 | 2;
  chapters: Chapter[];
}

export interface Grade {
  id: string;
  cycleId: string;
  titleFr: string;
  titleAr: string;
  units: Unit[];
}

export interface Cycle {
  id: string;
  titleFr: string;
  titleAr: string;
  grades: Grade[];
}
