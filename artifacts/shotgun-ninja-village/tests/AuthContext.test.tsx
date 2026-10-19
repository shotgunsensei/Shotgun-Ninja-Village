import React, { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { WATCH_KEY, markWatched } from "@/lib/watchProgress";
import type { VillageUser } from "@/services/community";

const api = vi.hoisted(() => ({
  me: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  syncProgress: vi.fn(),
}));
vi.mock("@/services/community", () => ({ accountApi: api }));

function user(id: string, watchedTransmissions: string[] = []): VillageUser {
  return {
    id,
    displayName: id,
    callsign: id,
    bio: "",
    avatarColor: "cyan",
    role: "member",
    tier: "free",
    archetype: null,
    watchedTransmissions,
    createdAt: "2026-10-19T00:00:00.000Z",
    badges: [],
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

let auth: ReturnType<typeof useAuth>;
function Probe() {
  auth = useAuth();
  return <output>{auth.user?.id ?? "guest"}</output>;
}

async function mountAs(account: VillageUser | null = user("alice")) {
  api.me.mockResolvedValueOnce({ user: account });
  await act(async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  api.logout.mockResolvedValue(undefined);
});
afterEach(cleanup);

describe("background account request lifetime", () => {
  for (const origin of ["initial import", "progress event"] as const) {
    for (const boundary of ["logout", "login", "register"] as const) {
      it(`ignores ${origin} success after ${boundary}`, async () => {
        const pending = deferred<{ user: VillageUser }>();
        api.syncProgress.mockReturnValueOnce(pending.promise);
        if (origin === "initial import") {
          localStorage.setItem(WATCH_KEY, JSON.stringify(["01"]));
        }
        await mountAs();
        if (origin === "progress event") {
          act(() => markWatched("01"));
        }
        expect(api.syncProgress).toHaveBeenCalledExactlyOnceWith({
          watchedTransmissions: ["01"],
        });
        const bob = user("bob", ["01"]);
        await act(async () => {
          if (boundary === "logout") await auth.logout();
          if (boundary === "login") {
            api.login.mockResolvedValueOnce({ user: bob });
            expect(
              await auth.login({
                email: "bob@example.test",
                password: "fixture",
              }),
            ).toEqual(bob);
          }
          if (boundary === "register") {
            api.register.mockResolvedValueOnce({ user: bob });
            expect(
              await auth.register({
                email: "bob@example.test",
                password: "fixture",
                displayName: "Bob",
                callsign: "bob",
                newsletterOptIn: false,
                termsAccepted: true,
              }),
            ).toEqual(bob);
          }
        });
        await act(async () => pending.resolve({ user: user("alice", ["01"]) }));
        expect(auth.user).toEqual(boundary === "logout" ? null : bob);
        expect(auth.error).toBeNull();
      });
    }

    it(`ignores ${origin} rejection after logout`, async () => {
      const pending = deferred<{ user: VillageUser }>();
      api.syncProgress.mockReturnValueOnce(pending.promise);
      if (origin === "initial import")
        localStorage.setItem(WATCH_KEY, '["01"]');
      await mountAs();
      if (origin === "progress event") act(() => markWatched("01"));
      await act(async () => auth.logout());
      await act(async () => pending.reject(new Error("old session")));
      expect(auth.user).toBeNull();
      expect(auth.error).toBeNull();
    });
  }

  for (const outcome of ["user", "unauthorized", "error"] as const) {
    it(`ignores a pending refresh ${outcome} after successful login`, async () => {
      await mountAs();
      const pending = deferred<{ user: VillageUser | null }>();
      api.me.mockReturnValueOnce(pending.promise);
      const refresh = auth.refresh();
      const bob = user("bob");
      api.login.mockResolvedValueOnce({ user: bob });
      await act(async () =>
        auth.login({ email: "bob@example.test", password: "fixture" }),
      );
      await act(async () => {
        if (outcome === "user") pending.resolve({ user: user("alice") });
        else
          pending.reject(
            outcome === "unauthorized"
              ? { status: 401 }
              : new Error("old request"),
          );
        await refresh;
      });
      expect(auth.user).toEqual(bob);
      expect(auth.error).toBeNull();
    });
  }

  it("ignores a refresh started while logout is pending once logout succeeds", async () => {
    await mountAs();
    const logout = deferred<void>();
    const me = deferred<{ user: VillageUser }>();
    api.logout.mockReturnValueOnce(logout.promise);
    api.me.mockReturnValueOnce(me.promise);
    const leaving = auth.logout();
    const refresh = auth.refresh();
    await act(async () => {
      logout.resolve();
      await leaving;
    });
    await act(async () => {
      me.resolve({ user: user("alice") });
      await refresh;
    });
    expect(auth.user).toBeNull();
  });

  it("invalidates old progress even when the same account logs in again", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    await act(async () => auth.logout());
    const current = {
      ...user("alice", ["01"]),
      displayName: "Current profile",
    };
    api.login.mockResolvedValueOnce({ user: current });
    await act(async () =>
      auth.login({ email: "alice@example.test", password: "fixture" }),
    );
    await act(async () => pending.resolve({ user: user("alice", ["01"]) }));
    expect(auth.user).toEqual(current);
  });

  it("invalidates progress when a refresh discovers a different account", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    const bob = user("bob", ["01"]);
    api.me.mockResolvedValueOnce({ user: bob });
    await act(async () => auth.refresh());
    await act(async () => pending.resolve({ user: user("alice", ["01"]) }));
    expect(auth.user).toEqual(bob);
  });

  it("does not restore progress after a current refresh receives 401", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    api.me.mockRejectedValueOnce({ status: 401 });
    await act(async () => auth.refresh());
    await act(async () => pending.resolve({ user: user("alice", ["01"]) }));
    expect(auth.user).toBeNull();
  });

  it("does not allow a StrictMode probe's old refresh to replace the current result", async () => {
    const old = deferred<{ user: VillageUser }>();
    api.me
      .mockReturnValueOnce(old.promise)
      .mockResolvedValueOnce({ user: user("bob") });
    await act(async () =>
      render(
        <StrictMode>
          <AuthProvider>
            <Probe />
          </AuthProvider>
        </StrictMode>,
      ),
    );
    await act(async () => old.resolve({ user: user("alice") }));
    expect(auth.user?.id).toBe("bob");
    expect(auth.loading).toBe(false);
  });

  it("ignores a progress response for a different account", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    await act(async () => pending.resolve({ user: user("bob", ["01"]) }));
    expect(auth.user?.id).toBe("alice");
  });

  it("does not let a listener awaiting cleanup dispatch for the old account", async () => {
    await mountAs();
    api.syncProgress.mockResolvedValue({ user: user("bob", ["01"]) });
    act(() => {
      auth.updateUser(user("bob", ["01"]));
      markWatched("01");
    });
    expect(api.syncProgress).not.toHaveBeenCalled();
    expect(auth.user?.id).toBe("bob");
  });

  it("invalidates earlier progress when an explicit profile update commits", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    const current = { ...user("alice", ["01"]), displayName: "Edited profile" };
    act(() => auth.updateUser(current));
    await act(async () => pending.resolve({ user: user("alice", ["01"]) }));
    expect(auth.user).toEqual(current);
  });

  it("removes the progress listener on unmount", async () => {
    await mountAs();
    cleanup();
    markWatched("01");
    expect(api.syncProgress).not.toHaveBeenCalled();
  });
});

describe("current account requests retain their behavior", () => {
  it("loads the current user and ends initial loading", async () => {
    await mountAs();
    expect(auth.user).toEqual(user("alice"));
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
  });

  it("retains initial import payload and accepts its current response", async () => {
    localStorage.setItem(WATCH_KEY, '["01"]');
    const current = user("alice", ["01"]);
    api.syncProgress.mockResolvedValueOnce({ user: current });
    await mountAs();
    expect(api.syncProgress).toHaveBeenCalledExactlyOnceWith({
      watchedTransmissions: ["01"],
    });
    expect(auth.user).toEqual(current);
    expect(localStorage.getItem(WATCH_KEY)).toBe('["01"]');
  });

  it("retains progress event payload and accepts its current response", async () => {
    await mountAs();
    const current = user("alice", ["01"]);
    api.syncProgress.mockResolvedValueOnce({ user: current });
    await act(async () => markWatched("01"));
    expect(api.syncProgress).toHaveBeenCalledExactlyOnceWith({
      watchedTransmissions: ["01"],
    });
    expect(auth.user).toEqual(current);
  });

  it("reports a current progress error", async () => {
    await mountAs();
    api.syncProgress.mockRejectedValueOnce(new Error("unavailable"));
    await act(async () => markWatched("01"));
    expect(auth.error).toBe("Badge progress could not be synced yet");
  });

  it("reports a current refresh error and ends loading", async () => {
    api.me.mockRejectedValueOnce(new Error("unavailable"));
    await act(async () =>
      render(
        <AuthProvider>
          <Probe />
        </AuthProvider>,
      ),
    );
    expect(auth.error).toBe("Account status could not be loaded");
    expect(auth.loading).toBe(false);
  });

  it("ends loading even when an initial refresh is invalidated by login", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.me.mockReturnValueOnce(pending.promise);
    await act(async () =>
      render(
        <AuthProvider>
          <Probe />
        </AuthProvider>,
      ),
    );
    api.login.mockResolvedValueOnce({ user: user("bob") });
    await act(async () =>
      auth.login({ email: "bob@example.test", password: "fixture" }),
    );
    await act(async () => pending.resolve({ user: user("alice") }));
    expect(auth.loading).toBe(false);
    expect(auth.user?.id).toBe("bob");
  });

  it("retains user state and rejects a failed logout", async () => {
    await mountAs();
    const failure = new Error("logout failed");
    api.logout.mockRejectedValueOnce(failure);
    await expect(auth.logout()).rejects.toBe(failure);
    expect(auth.user).toEqual(user("alice"));
  });

  it("accepts current progress after a failed login", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    api.login.mockRejectedValueOnce(new Error("wrong password"));
    await expect(
      auth.login({ email: "bob@example.test", password: "wrong" }),
    ).rejects.toThrow("wrong password");
    const current = user("alice", ["01"]);
    await act(async () => pending.resolve({ user: current }));
    expect(auth.user).toEqual(current);
  });

  it("does not discard a valid import when a same-account refresh finishes first", async () => {
    const pending = deferred<{ user: VillageUser }>();
    localStorage.setItem(WATCH_KEY, '["01"]');
    api.syncProgress.mockReturnValueOnce(pending.promise);
    await mountAs();
    api.me.mockResolvedValueOnce({ user: user("alice") });
    await act(async () => auth.refresh());
    const current = user("alice", ["01"]);
    await act(async () => pending.resolve({ user: current }));
    expect(auth.user).toEqual(current);
    expect(api.syncProgress).toHaveBeenCalledTimes(1);
  });

  it("accepts a fresh refresh after logout", async () => {
    await mountAs();
    await act(async () => auth.logout());
    api.me.mockResolvedValueOnce({ user: user("bob") });
    await act(async () => auth.refresh());
    expect(auth.user?.id).toBe("bob");
  });

  it("keeps the progress listener usable after a same-object explicit update", async () => {
    await mountAs();
    act(() => auth.updateUser(auth.user!));
    const current = user("alice", ["01"]);
    api.syncProgress.mockResolvedValueOnce({ user: current });
    await act(async () => markWatched("01"));
    expect(api.syncProgress).toHaveBeenCalledExactlyOnceWith({
      watchedTransmissions: ["01"],
    });
    expect(auth.user).toEqual(current);
  });

  it("keeps progress events during same-account listener replacement", async () => {
    await mountAs();
    const edited = { ...user("alice"), displayName: "Edited profile" };
    const current = { ...edited, watchedTransmissions: ["01"] };
    api.syncProgress.mockResolvedValueOnce({ user: current });
    await act(async () => {
      auth.updateUser(edited);
      markWatched("01");
    });
    expect(api.syncProgress).toHaveBeenCalledExactlyOnceWith({
      watchedTransmissions: ["01"],
    });
    expect(auth.user).toEqual(current);
  });
});
