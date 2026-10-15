import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { authenticate, restoreSession } from '../services/auth';
import { firebaseConfigured, getFirebase } from '../services/firebase';
import type { AuthValues } from '../utils/authValidation';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  ready: boolean;
  submit: (values: AuthValues, register: boolean) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [ready, setReady] = useState(firebaseConfigured);
  const operation = useRef(false);

  useEffect(() => {
    if (!firebaseConfigured) { setInitializing(false); return; }
    let disposed = false;
    let generation = 0;
    try {
      const unsubscribe = onAuthStateChanged(getFirebase().auth, async (next) => {
        // Registration must finish writing the profile before routes open.
        if (operation.current) return;
        const current = ++generation;
        setInitializing(true);
        try {
          const restored = next ? await restoreSession(next) : null;
          if (!disposed && current === generation) setUser(restored);
        } catch {
          if (!disposed && current === generation) setUser(null);
        } finally {
          if (!disposed && current === generation) setInitializing(false);
        }
      }, () => { setUser(null); setReady(false); setInitializing(false); });
      return () => { disposed = true; generation++; unsubscribe(); };
    } catch {
      setReady(false);
      setInitializing(false);
    }
  }, []);

  async function submit(values: AuthValues, register: boolean) {
    if (operation.current) return;
    operation.current = true;
    try {
      const next = await authenticate(values, register);
      setUser(next);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      operation.current = false;
    }
  }

  async function logout() {
    if (operation.current) return;
    operation.current = true;
    try { await signOut(getFirebase().auth); setUser(null); }
    finally { operation.current = false; }
  }

  return <AuthContext.Provider value={{ user, loading: initializing, ready, submit, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth requires AuthProvider');
  return value;
}
