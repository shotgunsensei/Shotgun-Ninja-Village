import React, { StrictMode } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import Account from "@/pages/Account";
import { WATCH_KEY } from "@/lib/watchProgress";
import { VillageApiError, type VillageUser } from "@/services/community";

const api = vi.hoisted(() => ({
  me: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  update: vi.fn(),
  syncProgress: vi.fn(),
}));
vi.mock("@/services/community", async (original) => ({
  ...(await original<typeof import("@/services/community")>()),
  accountApi: api,
}));

function account(id = "alice", displayName = "Alice"): VillageUser {
  return {
    id,
    displayName,
    callsign: id,
    bio: `${id} bio`,
    avatarColor: "cyan",
    role: "member",
    tier: "free",
    newsletterOptIn: false,
    archetype: null,
    watchedTransmissions: [],
    createdAt: "2026-10-19T00:00:00Z",
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
function Capture() {
  auth = useAuth();
  return null;
}
function Harness({ showAccount = true }: { showAccount?: boolean }) {
  return (
    <AuthProvider>
      <Capture />
      {showAccount && <Account />}
    </AuthProvider>
  );
}
async function mount() {
  api.me.mockResolvedValueOnce({ user: account() });
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(<Harness />);
  });
  return view;
}
function submit(name = "Edited Alice") {
  fireEvent.change(screen.getByLabelText("Display name"), {
    target: { value: name },
  });
  const button = screen.getByRole("button", { name: "Save profile" });
  fireEvent.submit(button.closest("form")!);
}
async function login(user: VillageUser) {
  api.login.mockResolvedValueOnce({ user });
  await act(async () =>
    auth.login({ email: `${user.id}@example.test`, password: "fixture" }),
  );
}
beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  api.logout.mockResolvedValue(undefined);
});
afterEach(cleanup);

describe("profile request account ownership", () => {
  for (const id of ["bob", "alice"]) {
    it(`does not dispatch the obsolete form before ${id}'s new session renders`, async () => {
      api.update.mockResolvedValue({ user: account(id, "New session") });
      await mount();
      const form = screen
        .getByRole("button", { name: "Save profile" })
        .closest("form")!;
      await act(async () => {
        api.login.mockResolvedValueOnce({ user: account(id, "New session") });
        await auth.login({ email: `${id}@example.test`, password: "fixture" });
        fireEvent.submit(form);
      });
      expect(api.update).not.toHaveBeenCalled();
      expect(auth.user?.displayName).toBe("New session");
      expect(screen.queryByText("Operator profile updated")).toBeNull();
    });
  }
  for (const boundary of [
    "logout",
    "different login",
    "same-ID relogin",
    "refresh identity change",
  ] as const) {
    it(`does not commit an old successful save after ${boundary}`, async () => {
      const pending = deferred<{ user: VillageUser }>();
      api.update.mockReturnValueOnce(pending.promise);
      await mount();
      submit();
      const next =
        boundary === "same-ID relogin"
          ? account("alice", "New Alice session")
          : account("bob", "Bob");
      await act(async () => {
        if (boundary === "logout") await auth.logout();
        if (boundary === "different login") {
          api.login.mockResolvedValueOnce({ user: next });
          await auth.login({ email: "bob@example.test", password: "fixture" });
        }
        if (boundary === "same-ID relogin") {
          await auth.logout();
          api.login.mockResolvedValueOnce({ user: next });
          await auth.login({
            email: "alice@example.test",
            password: "fixture",
          });
        }
        if (boundary === "refresh identity change") {
          api.me.mockResolvedValueOnce({ user: next });
          await auth.refresh();
        }
        // Resolve before the new account's React effects can establish ownership.
        pending.resolve({ user: account("alice", "Obsolete saved profile") });
        await pending.promise;
      });
      expect(auth.user).toEqual(boundary === "logout" ? null : next);
      expect(screen.queryByText("Operator profile updated")).toBeNull();
      if (boundary !== "logout")
        expect(
          screen.getByRole("button", { name: "Save profile" }),
        ).toHaveProperty("disabled", false);
    });
  }

  it("initializes the other account's uncontrolled profile fields", async () => {
    await mount();
    fireEvent.change(screen.getByLabelText("Display name"), {
      target: { value: "Unsaved Alice edit" },
    });
    await login(account("bob", "Bob"));
    expect(screen.getByLabelText("Display name")).toHaveProperty(
      "value",
      "Bob",
    );
    expect(screen.getByLabelText("Callsign")).toHaveProperty("value", "bob");
    expect(screen.getByLabelText("Operator bio")).toHaveProperty(
      "value",
      "bob bio",
    );
  });

  it("does not apply a save after the account page unmounts", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.update.mockReturnValueOnce(pending.promise);
    const view = await mount();
    submit();
    view.rerender(<Harness showAccount={false} />);
    await act(async () =>
      pending.resolve({ user: account("alice", "Unmounted page save") }),
    );
    expect(auth.user).toEqual(account());
  });

  it("rejects a profile response for a different user", async () => {
    api.update.mockResolvedValueOnce({
      user: account("bob", "Wrong response"),
    });
    await mount();
    await act(async () => submit());
    expect(auth.user).toEqual(account());
    expect(screen.getByRole("alert").textContent).toBe(
      "Profile could not be updated",
    );
    expect(screen.queryByText("Operator profile updated")).toBeNull();
    expect(screen.getByRole("button", { name: "Save profile" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("ignores an old save error after a different account signs in", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.update.mockReturnValueOnce(pending.promise);
    await mount();
    submit();
    await login(account("bob", "Bob"));
    await act(async () =>
      pending.reject(new VillageApiError(400, "Alice callsign conflict")),
    );
    expect(auth.user?.id).toBe("bob");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not let an old finally re-enable a new account's pending save", async () => {
    const old = deferred<{ user: VillageUser }>();
    const current = deferred<{ user: VillageUser }>();
    api.update
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise);
    await mount();
    submit();
    await login(account("bob", "Bob"));
    submit("Edited Bob");
    await act(async () => old.reject(new Error("old failure")));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    await act(async () =>
      current.resolve({ user: account("bob", "Edited Bob") }),
    );
    expect(auth.user?.displayName).toBe("Edited Bob");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });

  it("isolates a same-ID relogin's new pending save from the old error/finally", async () => {
    const old = deferred<{ user: VillageUser }>();
    const current = deferred<{ user: VillageUser }>();
    api.update
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise);
    await mount();
    submit();
    await act(async () => {
      await auth.logout();
      api.login.mockResolvedValueOnce({
        user: account("alice", "New Alice session"),
      });
      await auth.login({ email: "alice@example.test", password: "fixture" });
    });
    submit("New Alice edit");
    await act(async () =>
      old.reject(new VillageApiError(400, "Old session failure")),
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    await act(async () =>
      current.resolve({ user: account("alice", "New Alice edit") }),
    );
    expect(auth.user?.displayName).toBe("New Alice edit");
  });
});

describe("legitimate profile saves", () => {
  it("accepts an existing form before an ordinary same-ID refresh rerenders", async () => {
    await mount();
    const form = screen
      .getByRole("button", { name: "Save profile" })
      .closest("form")!;
    api.update.mockResolvedValueOnce({
      user: account("alice", "Edited Alice"),
    });
    api.me.mockResolvedValueOnce({ user: { ...account() } });
    await act(async () => {
      await auth.refresh();
      fireEvent.submit(form);
    });
    expect(api.update).toHaveBeenCalledTimes(1);
    expect(auth.user?.displayName).toBe("Edited Alice");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });
  for (const background of ["refresh", "initial progress import"] as const) {
    it(`keeps an accepted profile save authoritative over pending ${background}`, async () => {
      const pending = deferred<{ user: VillageUser }>();
      if (background === "initial progress import") {
        localStorage.setItem(WATCH_KEY, '["01"]');
        api.syncProgress.mockReturnValueOnce(pending.promise);
      }
      await mount();
      let refresh: Promise<void> | undefined;
      if (background === "refresh") {
        api.me.mockReturnValueOnce(pending.promise);
        refresh = auth.refresh();
      }
      const updated = {
        ...account("alice", "Edited Alice"),
        watchedTransmissions: ["01"],
      };
      api.update.mockResolvedValueOnce({ user: updated });
      await act(async () => submit());
      await act(async () => {
        pending.resolve({
          user: { ...account(), watchedTransmissions: ["01"] },
        });
        if (refresh) await refresh;
      });
      expect(auth.user).toEqual(updated);
      expect(screen.getByText("Operator profile updated")).toBeTruthy();
    });
  }
  it("accepts a current save after StrictMode effect replay", async () => {
    api.me.mockResolvedValue({ user: account() });
    api.update.mockResolvedValueOnce({
      user: account("alice", "Strict Alice"),
    });
    await act(async () =>
      render(
        <StrictMode>
          <Harness />
        </StrictMode>,
      ),
    );
    await act(async () => submit("Strict Alice"));
    expect(auth.user?.displayName).toBe("Strict Alice");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save profile" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("keeps the latest overlapping request in charge of user and busy state", async () => {
    const old = deferred<{ user: VillageUser }>();
    const current = deferred<{ user: VillageUser }>();
    api.update
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise);
    await mount();
    submit("Older edit");
    const form = screen
      .getByRole("button", { name: /Saving/ })
      .closest("form")!;
    fireEvent.change(screen.getByLabelText("Display name"), {
      target: { value: "Latest edit" },
    });
    // Programmatic form submission also must not let old callbacks own new work.
    fireEvent.submit(form);
    await act(async () =>
      old.resolve({ user: account("alice", "Older edit") }),
    );
    expect(auth.user).toEqual(account());
    expect(screen.queryByText("Operator profile updated")).toBeNull();
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    await act(async () =>
      current.resolve({ user: account("alice", "Latest edit") }),
    );
    expect(auth.user?.displayName).toBe("Latest edit");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });

  it("clears completed-save feedback after a same-ID relogin", async () => {
    api.update.mockResolvedValueOnce({
      user: account("alice", "Edited Alice"),
    });
    await mount();
    await act(async () => submit());
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
    await act(async () => {
      await auth.logout();
      api.login.mockResolvedValueOnce({
        user: account("alice", "New Alice session"),
      });
      await auth.login({ email: "alice@example.test", password: "fixture" });
    });
    expect(screen.queryByText("Operator profile updated")).toBeNull();
    expect(screen.getByRole("button", { name: "Save profile" })).toHaveProperty(
      "disabled",
      false,
    );
  });
  it("ignores an older failure while the same dashboard's newer save is pending", async () => {
    const old = deferred<{ user: VillageUser }>();
    const current = deferred<{ user: VillageUser }>();
    api.update
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise);
    await mount();
    submit("Older edit");
    fireEvent.submit(
      screen.getByRole("button", { name: /Saving/ }).closest("form")!,
    );
    await act(async () =>
      old.reject(new VillageApiError(400, "Older request error")),
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    await act(async () =>
      current.resolve({ user: account("alice", "Latest edit") }),
    );
    expect(auth.user?.displayName).toBe("Latest edit");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });
  it("preserves the update payload, user update and success/busy feedback", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.update.mockReturnValueOnce(pending.promise);
    await mount();
    submit();
    expect(api.update).toHaveBeenCalledExactlyOnceWith({
      displayName: "Edited Alice",
      callsign: "alice",
      bio: "alice bio",
      avatarColor: "cyan",
      newsletterOptIn: false,
    });
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    const updated = account("alice", "Edited Alice");
    await act(async () => pending.resolve({ user: updated }));
    expect(auth.user).toEqual(updated);
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save profile" })).toHaveProperty(
      "disabled",
      false,
    );
    api.me.mockResolvedValueOnce({ user: { ...updated } });
    await act(async () => auth.refresh());
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });

  it("keeps a valid pending save through an ordinary same-ID refresh", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.update.mockReturnValueOnce(pending.promise);
    await mount();
    submit();
    api.me.mockResolvedValueOnce({ user: { ...account() } });
    await act(async () => auth.refresh());
    expect(screen.getByRole("button", { name: /Saving/ })).toHaveProperty(
      "disabled",
      true,
    );
    await act(async () =>
      pending.resolve({ user: account("alice", "Edited Alice") }),
    );
    expect(auth.user?.displayName).toBe("Edited Alice");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });

  for (const failure of [
    new VillageApiError(400, "Callsign already used"),
    new Error("offline"),
  ]) {
    it(`preserves current save failure feedback: ${failure.message}`, async () => {
      api.update.mockRejectedValueOnce(failure);
      await mount();
      await act(async () => submit());
      expect(auth.user).toEqual(account());
      expect(screen.getByRole("alert").textContent).toBe(
        failure instanceof VillageApiError
          ? failure.message
          : "Profile could not be updated",
      );
      expect(
        screen.getByRole("button", { name: "Save profile" }),
      ).toHaveProperty("disabled", false);
    });
  }

  it("preserves a pending save after logout fails", async () => {
    const pending = deferred<{ user: VillageUser }>();
    api.update.mockReturnValueOnce(pending.promise);
    await mount();
    submit();
    api.logout.mockRejectedValueOnce(new Error("logout failed"));
    await expect(auth.logout()).rejects.toThrow("logout failed");
    await act(async () =>
      pending.resolve({ user: account("alice", "Edited Alice") }),
    );
    expect(auth.user?.displayName).toBe("Edited Alice");
    expect(screen.getByText("Operator profile updated")).toBeTruthy();
  });
});
