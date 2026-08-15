import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Award,
  CheckCircle2,
  LogIn,
  LogOut,
  Save,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { BadgeGrid } from "@/components/community/BadgeGrid";
import { OperatorAvatar } from "@/components/community/OperatorAvatar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getQuizResult } from "@/lib/operatorRecord";
import { getWatched } from "@/lib/watchProgress";
import {
  accountApi,
  VillageApiError,
  type VillageUser,
} from "@/services/community";

const inputClass =
  "w-full border border-input bg-background px-3 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function safeReturnPath(): string {
  if (typeof window === "undefined") return "/community";
  const value = new URLSearchParams(window.location.search).get("returnTo");
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/community";
}

export default function Account() {
  usePageMeta({
    title: "Operator Account",
    description:
      "Create or manage your Shotgun Ninja account, callsign, progress, and Village badges.",
  });
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div
        className="container mx-auto max-w-5xl px-4 py-16"
        role="status"
        aria-live="polite"
      >
        <div className="h-8 w-48 animate-pulse bg-muted" />
        <div className="mt-6 h-64 animate-pulse border border-border bg-card" />
        <span className="sr-only">Loading operator account</span>
      </div>
    );
  }

  return auth.user ? <AccountDashboard user={auth.user} /> : <AuthGateway />;
}

function AuthGateway() {
  const queryMode =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("mode")
      : null;
  const [mode, setMode] = useState<"signup" | "login">(
    queryMode === "login" ? "login" : "signup",
  );
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState("");
  const auth = useAuth();
  const [, navigate] = useLocation();

  const submitSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 10) {
      setError("Use at least 10 characters for your password");
      return;
    }

    setStatus("working");
    setError("");
    try {
      const quiz = getQuizResult();
      await auth.register({
        displayName: String(data.get("displayName") ?? ""),
        email: String(data.get("email") ?? ""),
        callsign: String(data.get("callsign") ?? ""),
        password,
        newsletterOptIn: data.get("newsletterOptIn") === "on",
        termsAccepted: true,
        archetype: quiz?.archetype,
        watchedTransmissions: getWatched(),
      });
      navigate(safeReturnPath());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Account could not be created",
      );
    } finally {
      setStatus("idle");
    }
  };

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("working");
    setError("");
    try {
      await auth.login({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
      });
      navigate(safeReturnPath());
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Sign in failed",
      );
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="absolute inset-0 account-field" aria-hidden="true" />
      <div className="relative container mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        <section className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase text-primary">
            <ShieldCheck size={14} aria-hidden="true" /> Secure Village Identity
          </div>
          <h1 className="text-balance font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">
            Claim your
            <br />
            <span className="text-primary">callsign.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
            One free account unlocks posting and replies across every public
            Village channel, a persistent operator profile, and badges tied to
            what you actually complete.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Join discussions"],
              ["02", "Sync milestones"],
              ["03", "Display badges"],
            ].map(([number, label]) => (
              <div key={number} className="border border-border bg-card/70 p-3">
                <span className="font-mono text-[10px] text-primary">
                  {number}
                </span>
                <span className="mt-1 block font-display text-lg uppercase text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="border border-primary/35 bg-card/95 p-5 shadow-2xl md:p-8"
          aria-labelledby="account-form-title"
        >
          <div
            className="mb-6 grid grid-cols-2 border border-border bg-background p-1"
            role="tablist"
            aria-label="Account action"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={
                mode === "signup"
                  ? "bg-primary px-4 py-2.5 font-mono text-xs uppercase text-white"
                  : "px-4 py-2.5 font-mono text-xs uppercase text-muted-foreground hover:text-white"
              }
            >
              Create account
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={
                mode === "login"
                  ? "bg-primary px-4 py-2.5 font-mono text-xs uppercase text-white"
                  : "px-4 py-2.5 font-mono text-xs uppercase text-muted-foreground hover:text-white"
              }
            >
              Sign in
            </button>
          </div>

          <h2
            id="account-form-title"
            className="text-balance font-display text-3xl uppercase text-white"
          >
            {mode === "signup" ? "Enlist in the Village" : "Resume your signal"}
          </h2>
          <p className="mt-1 text-pretty font-mono text-xs text-muted-foreground">
            {mode === "signup"
              ? "Free, immediate access. No credit card required."
              : "Use the email and password tied to your callsign."}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs text-red-200"
            >
              {error}
            </p>
          )}

          {mode === "signup" ? (
            <form onSubmit={submitSignup} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Display name"
                  name="displayName"
                  autoComplete="name"
                  placeholder="John Williams"
                  hint="Shown on your public operator profile"
                />
                <Field
                  label="Callsign"
                  name="callsign"
                  autoComplete="username"
                  placeholder="signal_ronin"
                  hint="3–24 letters, numbers, _ or -"
                />
              </div>
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="10+ characters"
                />
                <Field
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 border border-border bg-background/50 p-3">
                <input
                  name="newsletterOptIn"
                  type="checkbox"
                  className="mt-0.5 size-4 accent-red-600"
                />
                <span className="text-pretty font-mono text-xs leading-relaxed text-muted-foreground">
                  Send me transmission alerts and classified drops. This earns
                  the Archive Enlisted badge; I can opt out from my account.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  name="terms"
                  required
                  type="checkbox"
                  className="mt-0.5 size-4 accent-red-600"
                />
                <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    className="text-secondary underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-secondary underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <button
                disabled={status === "working"}
                className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 font-display text-xl uppercase text-white hover:bg-primary/90 disabled:opacity-60"
              >
                <UserPlus size={18} aria-hidden="true" />{" "}
                {status === "working" ? "Creating account…" : "Claim callsign"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitLogin} className="mt-6 space-y-4">
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
              <Field
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
              />
              <button
                disabled={status === "working"}
                className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 font-display text-xl uppercase text-white hover:bg-primary/90 disabled:opacity-60"
              >
                <LogIn size={18} aria-hidden="true" />{" "}
                {status === "working" ? "Signing in…" : "Enter the Village"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase text-slate-300">
        {label}
      </span>
      <input {...props} required className={inputClass} />
      {hint && (
        <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}

function AccountDashboard({ user }: { user: VillageUser }) {
  const auth = useAuth();
  const [, navigate] = useLocation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const earnedCount = user.badges.filter((badge) => badge.earned).length;

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await accountApi.update({
        displayName: String(data.get("displayName") ?? ""),
        callsign: String(data.get("callsign") ?? ""),
        bio: String(data.get("bio") ?? ""),
        avatarColor: String(
          data.get("avatarColor") ?? "crimson",
        ) as VillageUser["avatarColor"],
        newsletterOptIn: data.get("newsletterOptIn") === "on",
      });
      auth.updateUser(result.user);
      setMessage("Operator profile updated");
    } catch (requestError) {
      setError(
        requestError instanceof VillageApiError
          ? requestError.message
          : "Profile could not be updated",
      );
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await auth.logout();
    navigate("/community");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-16">
      <header className="border-b border-border pb-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <OperatorAvatar
              callsign={user.callsign}
              color={user.avatarColor}
              className="size-14 text-base"
            />
            <div>
              <span className="font-mono text-[10px] uppercase text-primary">
                Authenticated Operator
              </span>
              <h1 className="text-balance font-display text-4xl uppercase text-white md:text-5xl">
                {user.displayName}
              </h1>
              <p className="font-mono text-xs text-muted-foreground">
                @{user.callsign} · {user.tier} access
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/community/operator/${user.callsign}`}
              className="border border-secondary/40 px-4 py-2 font-mono text-xs uppercase text-secondary hover:bg-secondary/10"
            >
              View public profile
            </Link>
            <button
              onClick={() => void logout()}
              className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:border-primary/40 hover:text-white"
            >
              <LogOut size={13} aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <section className="border border-border bg-card p-5 md:p-6">
          <h2 className="text-balance font-display text-2xl uppercase text-white">
            Profile controls
          </h2>
          <p className="mt-1 text-pretty font-mono text-xs text-muted-foreground">
            This name, callsign, bio, and badge flair appear with your Village
            posts.
          </p>
          {message && (
            <p
              role="status"
              className="mt-4 flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-xs text-emerald-200"
            >
              <CheckCircle2 size={13} />
              {message}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs text-red-200"
            >
              {error}
            </p>
          )}
          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <Field
              label="Display name"
              name="displayName"
              defaultValue={user.displayName}
              autoComplete="name"
            />
            <Field
              label="Callsign"
              name="callsign"
              defaultValue={user.callsign}
              autoComplete="username"
            />
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase text-slate-300">
                Operator bio
              </span>
              <textarea
                name="bio"
                maxLength={400}
                defaultValue={user.bio}
                rows={5}
                className={inputClass}
                placeholder="What do you build, trace, protect, or break?"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase text-slate-300">
                Signal color
              </span>
              <select
                name="avatarColor"
                defaultValue={user.avatarColor}
                className={inputClass}
              >
                <option value="crimson">Crimson</option>
                <option value="cyan">Cyan</option>
                <option value="amber">Amber</option>
                <option value="emerald">Emerald</option>
                <option value="violet">Violet</option>
              </select>
            </label>
            <label className="flex cursor-pointer items-start gap-3 border border-border bg-background/50 p-3">
              <input
                name="newsletterOptIn"
                type="checkbox"
                defaultChecked={user.newsletterOptIn}
                className="mt-0.5 size-4 accent-red-600"
              />
              <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                Transmission alerts and classified drop email
              </span>
            </label>
            <button
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs uppercase text-white hover:bg-primary/90 disabled:opacity-60"
            >
              <Save size={14} aria-hidden="true" />{" "}
              {saving ? "Saving…" : "Save profile"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-primary">
                <Award size={13} /> Persistent achievements
              </span>
              <h2 className="text-balance font-display text-3xl uppercase text-white">
                Badge rack
              </h2>
            </div>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {earnedCount}/{user.badges.length} earned
            </span>
          </div>
          <BadgeGrid badges={user.badges} />
          <div className="mt-6 border border-secondary/25 bg-secondary/5 p-5">
            <h3 className="text-balance font-display text-xl uppercase text-white">
              Next best action
            </h3>
            {!user.archetype ? (
              <p className="mt-1 text-pretty font-mono text-xs text-muted-foreground">
                Complete{" "}
                <Link href="/alignment" className="text-secondary underline">
                  Operator Alignment
                </Link>{" "}
                to lock your archetype and earn a profile badge.
              </p>
            ) : (
              <p className="mt-1 text-pretty font-mono text-xs text-muted-foreground">
                Start or reply to a{" "}
                <Link href="/community" className="text-secondary underline">
                  Village discussion
                </Link>{" "}
                to build your community badge record.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
