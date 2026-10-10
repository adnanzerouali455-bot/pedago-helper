export type LandingLanguage = "fr" | "ar" | "en";

type Three<T> = readonly [T, T, T];
type Four<T> = readonly [T, T, T, T];

export interface Messages {
  nav: { home: string; spaces: string; how: string; open: string; language: string; theme: string; light: string; dark: string };
  hero: { badges: Three<string>; before: string; accent: string; after: string; body: string; open: string; discover: string; demo: string; available: string };
  analysis: { label: string; title: string; rows: Four<string>; stamp: string; note: string };
  constat: { eyebrow: string; title: string; subtitle: string; metrics: Three<{ label: string; detail: string }>; source: string; qualification: string };
  spaces: {
    eyebrow: string; title: string; intro: string; preview: string; schoolAction: string;
    teacher: { label: string; title: string; body: string; features: Three<string>; note: string; action: string; photoAlt: string };
    student: { label: string; title: string; body: string; features: Three<string>; note: string; action: string; photoAlt: string };
  };
  how: { eyebrow: string; title: string; steps: Four<{ title: string; body: string }>; badges: Four<string>; note: string };
  science: { eyebrow: string; title: string; intro: string; cards: Three<{ title: string; body: string }>; ethics: string };
  cta: { eyebrow: string; title: string; body: string; action: string };
  footer: { legal: string; source: string; photoNote: string };
}
