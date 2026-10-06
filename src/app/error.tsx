"use client";

import { useEffect } from "react";
import { PawPrint, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[cac:error]", error);
  }, [error]);

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-brand text-white">
          <PawPrint size={30} aria-hidden />
        </span>
        <span className="subheading">Error 500</span>
        <h1 className="text-[30px] font-extrabold">Something went wrong. Please try again.</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-body">
          Our team has been notified. If it keeps happening, call us on{" "}
          <a href="tel:+254112272061" className="font-bold text-pine">+254 112 272 061</a> — emergencies
          are answered 24/7.
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-7">
          <RotateCcw size={15} aria-hidden /> Try Again
        </button>
        {error.digest && <p className="meta mt-5 !normal-case">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}
