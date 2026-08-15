import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getQuizResult } from "@/lib/operatorRecord";
import { getWatched } from "@/lib/watchProgress";
import {
  accountApi,
  type RegisterAccountInput,
  type VillageUser,
} from "@/services/community";

interface AuthContextValue {
  user: VillageUser | null;
  loading: boolean;
  error: string | null;
  register: (input: RegisterAccountInput) => Promise<VillageUser>;
  login: (input: { email: string; password: string }) => Promise<VillageUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (user: VillageUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<VillageUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const syncedUserId = useRef<string | null>(null);

  const refresh = async () => {
    try {
      const result = await accountApi.me();
      setUser(result.user);
      setError(null);
    } catch (requestError) {
      if (
        requestError &&
        typeof requestError === "object" &&
        "status" in requestError &&
        requestError.status === 401
      ) {
        setUser(null);
      } else {
        setError("Account status could not be loaded");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!user || syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;
    const quiz = getQuizResult();
    const watched = getWatched();
    const needsArchetype = quiz && !user.archetype;
    const needsWatched = watched.some(
      (transmission) => !user.watchedTransmissions.includes(transmission),
    );
    if (!needsArchetype && !needsWatched) return;

    accountApi
      .syncProgress({
        ...(needsArchetype ? { archetype: quiz.archetype } : {}),
        ...(needsWatched ? { watchedTransmissions: watched } : {}),
      })
      .then((result) => setUser(result.user))
      .catch(() => setError("Local badge progress could not be synced yet"));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const syncCurrentProgress = () => {
      const quiz = getQuizResult();
      const watched = getWatched();
      const needsArchetype = quiz && quiz.archetype !== user.archetype;
      const needsWatched = watched.some(
        (transmission) => !user.watchedTransmissions.includes(transmission),
      );
      if (!needsArchetype && !needsWatched) return;
      accountApi
        .syncProgress({
          ...(needsArchetype ? { archetype: quiz.archetype } : {}),
          ...(needsWatched ? { watchedTransmissions: watched } : {}),
        })
        .then((result) => setUser(result.user))
        .catch(() => setError("Badge progress could not be synced yet"));
    };
    window.addEventListener("sn:progress", syncCurrentProgress);
    return () => window.removeEventListener("sn:progress", syncCurrentProgress);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      async register(input) {
        const result = await accountApi.register(input);
        setUser(result.user);
        syncedUserId.current = result.user.id;
        return result.user;
      },
      async login(input) {
        const result = await accountApi.login(input);
        setUser(result.user);
        syncedUserId.current = null;
        return result.user;
      },
      async logout() {
        await accountApi.logout();
        setUser(null);
        syncedUserId.current = null;
      },
      refresh,
      updateUser: setUser,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
