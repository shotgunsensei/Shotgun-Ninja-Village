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
  const mounted = useRef(true);
  const sessionEpoch = useRef(0);
  const currentUser = useRef<VillageUser | null>(null);

  // Background responses belong to the account lifetime that started them.
  // Explicit account actions remain authoritative, including a new login to
  // the same account. A same-account refresh must not cancel a pending import.
  const commitUser = (next: VillageUser | null, newLifetime = false) => {
    if (newLifetime || currentUser.current?.id !== next?.id)
      sessionEpoch.current++;
    currentUser.current = next;
    setUser(next);
  };
  const isCurrentSession = (epoch: number) =>
    mounted.current && sessionEpoch.current === epoch;

  const refresh = async () => {
    const epoch = sessionEpoch.current;
    try {
      const result = await accountApi.me();
      if (!isCurrentSession(epoch)) return;
      commitUser(result.user);
      setError(null);
    } catch (requestError) {
      if (!isCurrentSession(epoch)) return;
      if (
        requestError &&
        typeof requestError === "object" &&
        "status" in requestError &&
        requestError.status === 401
      ) {
        commitUser(null, true);
      } else {
        setError("Account status could not be loaded");
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
      sessionEpoch.current++;
    };
  }, []);

  useEffect(() => {
    if (
      !user ||
      currentUser.current !== user ||
      syncedUserId.current === user.id
    )
      return;
    syncedUserId.current = user.id;
    const quiz = getQuizResult();
    const watched = getWatched();
    const needsArchetype = quiz && !user.archetype;
    const needsWatched = watched.some(
      (transmission) => !user.watchedTransmissions.includes(transmission),
    );
    if (!needsArchetype && !needsWatched) return;
    const epoch = sessionEpoch.current;

    accountApi
      .syncProgress({
        ...(needsArchetype ? { archetype: quiz.archetype } : {}),
        ...(needsWatched ? { watchedTransmissions: watched } : {}),
      })
      .then((result) => {
        if (isCurrentSession(epoch) && result.user.id === user.id) {
          commitUser(result.user);
        }
      })
      .catch(() => {
        if (isCurrentSession(epoch)) {
          setError("Local badge progress could not be synced yet");
        }
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const syncCurrentProgress = () => {
      // A listener awaiting React's cleanup can still serve the current
      // account, but must never dispatch from its obsolete render snapshot.
      const account = currentUser.current;
      if (!mounted.current || !account) return;
      const epoch = sessionEpoch.current;
      const quiz = getQuizResult();
      const watched = getWatched();
      const needsArchetype = quiz && quiz.archetype !== account.archetype;
      const needsWatched = watched.some(
        (transmission) => !account.watchedTransmissions.includes(transmission),
      );
      if (!needsArchetype && !needsWatched) return;
      accountApi
        .syncProgress({
          ...(needsArchetype ? { archetype: quiz.archetype } : {}),
          ...(needsWatched ? { watchedTransmissions: watched } : {}),
        })
        .then((result) => {
          if (isCurrentSession(epoch) && result.user.id === account.id) {
            commitUser(result.user);
          }
        })
        .catch(() => {
          if (isCurrentSession(epoch)) {
            setError("Badge progress could not be synced yet");
          }
        });
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
        commitUser(result.user, true);
        syncedUserId.current = result.user.id;
        return result.user;
      },
      async login(input) {
        const result = await accountApi.login(input);
        commitUser(result.user, true);
        syncedUserId.current = null;
        return result.user;
      },
      async logout() {
        await accountApi.logout();
        commitUser(null, true);
        syncedUserId.current = null;
      },
      refresh,
      updateUser: (next) => commitUser(next, true),
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
