"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Google reCAPTCHA v3 (invisible) for every form on the site.
 * When NEXT_PUBLIC_RECAPTCHA_SITE_KEY is absent (local dev), tokens resolve
 * to the "dev-bypass" sentinel which the server accepts in dev mode.
 * Low v3 scores (< 0.5 server-side) trigger the ReCaptchaV2 checkbox below.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void },
      ) => number;
    };
    __cacRecaptchaScriptPromise?: Promise<void>;
  }
}

const V3_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const V2_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY ?? "";

function loadScript(src: string): Promise<void> {
  window.__cacRecaptchaScriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
  return window.__cacRecaptchaScriptPromise;
}

interface RecaptchaContextValue {
  execute: (action: string) => Promise<string>;
  configured: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextValue>({
  execute: async () => "dev-bypass",
  configured: false,
});

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const configured = Boolean(V3_KEY);

  const execute = useCallback(
    async (action: string) => {
      if (!configured) return "dev-bypass";
      try {
        await loadScript(`https://www.google.com/recaptcha/api.js?render=${V3_KEY}`);
        return await new Promise<string>((resolve) => {
          window.grecaptcha!.ready(() => {
            window.grecaptcha!.execute(V3_KEY, { action }).then(resolve).catch(() => resolve("dev-bypass"));
          });
        });
      } catch {
        return "dev-bypass";
      }
    },
    [configured],
  );

  const value = useMemo(() => ({ execute, configured }), [execute, configured]);
  return <RecaptchaContext.Provider value={value}>{children}</RecaptchaContext.Provider>;
}

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

/** Checkbox fallback shown when the server reports a low v3 score. */
export function ReCaptchaV2({ onToken }: { onToken: (token: string) => void }) {
  const holder = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!V2_KEY || !holder.current) return;
    let cancelled = false;
    loadScript("https://www.google.com/recaptcha/api.js")
      .then(() => {
        if (cancelled || !holder.current || !window.grecaptcha) return;
        window.grecaptcha.ready(() => {
          if (!holder.current || !window.grecaptcha) return;
          holder.current.innerHTML = "";
          window.grecaptcha.render(holder.current, {
            sitekey: V2_KEY,
            callback: (token: string) => onTokenRef.current(token),
          });
          setReady(true);
        });
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!V2_KEY) {
    return (
      <p className="rounded-brand border border-line bg-mist p-3 text-[13px] text-body">
        Additional verification is required. Please call us on{" "}
        <a href="tel:+254112272061" className="font-bold text-pine">
          +254 112 272 061
        </a>{" "}
        to complete your request.
      </p>
    );
  }
  return (
    <div className="rounded-brand border border-line bg-mist p-3">
      <p className="meta mb-2">One more step — please confirm you are human:</p>
      <div ref={holder} />
      {!ready && <p className="text-[12px] text-body">Loading verification…</p>}
    </div>
  );
}
