import { defineStore } from 'pinia';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpmgywdwweefvzmywudj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwbWd5d2R3d2VlZnZ6bXl3dWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzY4MjAsImV4cCI6MjAyNjk1MjgyMH0.Ox40QFrKeN6V16qr6Ji53CnNfy0xo_3tQ1agkUe2R-E';
const supabase = createClient(supabaseUrl, supabaseKey);

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    error: null,
  }),
  actions: {
    async signUp(email, password) {
      try {
        const { user, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        this.user = user;
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    async signIn(email, password) {
      try {
        const { user, error } = await supabase.auth.signIn({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        this.user = user;
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    async signOut() {
      try {
        await supabase.auth.signOut();
        this.user = null;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
