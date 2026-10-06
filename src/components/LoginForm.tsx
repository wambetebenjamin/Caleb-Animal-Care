"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, PawPrint } from "lucide-react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.email.includes("@") || form.password.length < 6) {
      setError("Enter your email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      name: mode === "create" ? form.name : undefined,
    });
    setBusy(false);
    if (res?.ok) {
      window.location.href = callbackUrl;
    } else {
      setError(mode === "create" ? "Could not create the account. Try again." : "Wrong password for this email, or create an account instead.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-brand bg-white p-7 shadow-card">
      <div className="mb-5 text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
          <PawPrint size={26} aria-hidden />
        </span>
        <h1 className="text-[20px] font-extrabold">{mode === "create" ? "Create your owner account" : "Welcome back"}</h1>
        <p className="mt-1 text-[13px] text-body">
          The pet portal keeps {mode === "create" ? "your animals' vaccinations," : "your animals' vaccinations,"} reminders and visit history in one place.
        </p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2" role="tablist" aria-label="Sign in or create account">
        {(["signin", "create"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`min-h-[44px] rounded-brand border text-[12px] font-bold uppercase tracking-[1px] transition-all duration-300 ${
              mode === m ? "border-pine bg-pine text-white" : "border-line text-body hover:border-pine"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {mode === "create" && (
          <input className="field min-h-[48px]" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="field min-h-[48px]" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          className="field min-h-[48px]"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      {error && <p className="mt-3 text-[12px] font-medium text-emergency">{error}</p>}
      <button type="button" onClick={submit} disabled={busy} className="btn-primary mt-4 w-full justify-center disabled:opacity-60">
        {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
        {mode === "create" ? "Create Account & Sign In" : "Sign In"}
      </button>
      <p className="meta mt-3 !normal-case">
        Demo portal: first sign-in with a new email creates the account with that password.
      </p>
    </div>
  );
}
