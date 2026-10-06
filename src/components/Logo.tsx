import Link from "next/link";
import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

/** Zip navbar-brand: `<flaticon-pawprint> Pet sitting` — paw span in brand green. */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Caleb Animal Care — home"
      className="group inline-flex items-center gap-2"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-card transition-transform duration-300 group-hover:scale-105">
        <PawPrint size={22} strokeWidth={2.2} aria-hidden />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[20px] font-extrabold tracking-tight",
            light ? "text-white" : "text-heading",
          )}
        >
          Caleb <span className="text-pine">Animal Care</span>
        </span>
        {!compact && (
          <span className={cn("meta mt-1 block !normal-case", light ? "text-white/70" : "text-body")}>
            Nairobi • Pets • Livestock • Wildlife
          </span>
        )}
      </span>
    </Link>
  );
}
