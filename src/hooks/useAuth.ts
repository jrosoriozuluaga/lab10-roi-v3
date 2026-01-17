import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    // For this demo, we'll try to sign in with password if provided, 
    // but the UI currently only asks for email in some flows. 
    // We should update to support password or magic link.
    // However, looking at Auth.tsx, it DOES collect password.
    // We need to update the signature of signIn to accept password.

    // NOTE: The previous interface was signIn(email). We need to support the existing UI calls.
    // But Auth.tsx calls signIn(email) but HAS password state. 
    // We need to look at Auth.tsx again. It collects password but didn't pass it to signIn!
    // AHH, wait. In Step 85, Auth.tsx: `const { error } = await signIn(email);` 
    // It IGNORES the password state `password`.
    // I need to update Auth.tsx as well!

    // Let's implement this correctly.
    return { error: new Error("Please update Auth.tsx to pass password") };
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'authenticated', // Default role
        }
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn: signInWithPassword, // Use the real one
    signUp,
    signOut,
  };
}
