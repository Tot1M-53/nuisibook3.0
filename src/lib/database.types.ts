export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          company: string | null;
          email: string;
          phone: string;
          address: string;
          city: string;
          postal_code: string;
          appointment_date: string;
          appointment_time: string;
          treatment_type: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          company?: string | null;
          email: string;
          phone: string;
          address: string;
          city: string;
          postal_code: string;
          appointment_date: string;
          appointment_time: string;
          treatment_type: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          appointment_date?: string;
          appointment_time?: string;
          treatment_type?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}