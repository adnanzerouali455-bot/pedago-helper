export type UserRole = "teacher" | "student" | "school";

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  city: string | null;
  school_name: string | null;
  subject: string | null;
  teaching_cycle: string | null;
  grade: string | null;
  branch: string | null;
  institution_type: string | null;
  teacher_count: number | null;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "email" | "role" | "created_at">>;
        Relationships: [];
      };
      user_documents: {
        Row: { user_id: string; document_key: string; value: Json; updated_at: string };
        Insert: { user_id: string; document_key: string; value: Json; updated_at?: string };
        Update: { value?: Json; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { user_role: UserRole };
    CompositeTypes: Record<string, never>;
  };
}

export const rolePath: Record<UserRole, string> = {
  teacher: "/espace-enseignant",
  student: "/espace-eleve",
  school: "/espace-etablissement",
};

export function isUserRole(value: unknown): value is UserRole {
  return value === "teacher" || value === "student" || value === "school";
}
