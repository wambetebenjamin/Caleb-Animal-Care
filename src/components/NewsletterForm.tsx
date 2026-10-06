"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useRecaptcha, ReCaptchaV2 } from "./RecaptchaProvider";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { execute } = useRecaptcha();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [needV2, setNeedV2] = useState(false);

  async function submit(token?: string, e?: FormEvent) {
    e?.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      return;
    }
    setState("busy");
    const captcha = token ?? (await execute("newsletter"));
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: captcha }),
    });
    const data = (await res.json()) as { ok: boolean; code?: string };
    if (data.ok) {
      setState("done");
      setNeedV2(false);
    } else if (data.code === "RECAPTCHA_V2_REQUIRED" && !needV2) {
      setNeedV2(true);
      setState("idle");
    } else {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("flex min-h-[48px] items-center gap-2 text-[13px] font-bold", dark ? "text-pine" : "text-pine")}>
        <CheckCircle2 size={18} aria-hidden /> Asante! You&apos;re subscribed — tips land monthly.
      </p>
    );
  }

  return (
    <form onSubmit={(e) => submit(undefined, e)} noValidate={false}>
      <div className="flex w-full max-w-md gap-2">
        <label className="sr-only" htmlFor={dark ? "nl-footer" : "nl-main"}>
          Email address
        </label>
        <input
          id={dark ? "nl-footer" : "nl-main"}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="you@example.co.ke"
          className={cn(
            "min-h-[48px] w-full rounded-brand border px-4 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-pine/40",
            dark
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/50"
              : "border-line bg-white text-heading placeholder:text-body/60",
          )}
        />
        <button type="submit" disabled={state === "busy"} className="btn-primary shrink-0 !px-4 disabled:opacity-60">
          {state === "busy" ? "…" : compact ? <Send size={16} aria-hidden /> : "Subscribe"}
          {compact && <span className="sr-only">Subscribe</span>}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-[12px] font-medium text-emergency">Enter a valid email to subscribe.</p>}
      <p className={cn("mt-2 text-[11px]", dark ? "text-white/50" : "text-body/70")}>
        Protected by reCAPTCHA. Unsubscribe any time.
      </p>
      {needV2 && <div className="mt-3"><ReCaptchaV2 onToken={(t) => submit(`v2:${t}`, undefined)} /></div>}
    </form>
  );
}
