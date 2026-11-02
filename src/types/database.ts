export type Database = {
  public: {
    Tables: {
      leadership_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          photo_src: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          photo_src?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          photo_src?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_access: {
        Row: {
          email: string;
          granted_by: string;
          created_at: string;
        };
        Insert: {
          email: string;
          granted_by: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          granted_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      membership_applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          city: string;
          age: number | null;
          education: string | null;
          interests: string | null;
          experience: string | null;
          availability: string | null;
          message: string;
          status: "pending" | "reviewed" | "accepted" | "declined";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          city: string;
          age: number;
          education: string;
          interests: string;
          experience?: string | null;
          availability: string;
          message: string;
          status?: "pending" | "reviewed" | "accepted" | "declined";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          city?: string;
          age?: number | null;
          education?: string | null;
          interests?: string | null;
          experience?: string | null;
          availability?: string | null;
          message?: string;
          status?: "pending" | "reviewed" | "accepted" | "declined";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
