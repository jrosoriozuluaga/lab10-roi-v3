import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client'; // Removed unused client

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted mock session
    const storedSession = localStorage.getItem('mock_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        console.error('Failed to parse mock session', e);
        localStorage.removeItem('mock_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    // Mock successful login for any email
    const mockUser: User = {
      id: 'mock-user-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: email,
      phone: '',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    };

    const mockSession: Session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    localStorage.setItem('mock_session', JSON.stringify(mockSession));
    setSession(mockSession);
    setUser(mockUser);

    return { error: null };
  };

  const signUp = async (email: string) => {
    // Mock signup is just signin
    return signIn(email);
  };

  const signOut = async () => {
    localStorage.removeItem('mock_session');
    setSession(null);
    setUser(null);
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
