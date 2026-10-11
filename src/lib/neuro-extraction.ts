import { z } from "zod";

export const neuroExtractionInputSchema = z.object({
  courseTitle: z.string().trim().min(2).max(240),
  grade: z.string().trim().min(2).max(160),
  courseSummaryOrText: z.string().trim().max(8_000).optional(),
  language: z.enum(["fr", "ar", "en"]).default("en"),
}).strict();

export const extractedTermSchema = z.object({
  term: z.string().trim().min(2).max(120),
  morphology: z.string().trim().min(8).max(1_000),
  everydayAnalogy: z.string().trim().min(8).max(1_000),
  darijaExplanation: z.string().trim().min(8).max(1_000),
  visualAnchor: z.string().trim().min(8).max(1_000),
  activeRecallQuestion: z.string().trim().min(8).max(500),
  activeRecallAnswer: z.string().trim().min(2).max(1_000),
}).strict();

export const neuroExtractionSchema = z.object({
  localizedCourseTitle: z.string().trim().min(2).max(240),
  cognitiveDiagnosis: z.string().trim().min(12).max(1_000),
  terms: z.array(extractedTermSchema).min(3).max(5),
  spacedReviewAdvice: z.string().trim().min(12).max(1_000),
}).strict();

export type NeuroExtractionInput = z.infer<typeof neuroExtractionInputSchema>;
export type ExtractedTerm = z.infer<typeof extractedTermSchema>;
export type NeuroExtractionResponse = z.infer<typeof neuroExtractionSchema>;
