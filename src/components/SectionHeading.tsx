import { cn } from "@/lib/utils";

/** Zip `.heading-section`: green uppercase subheading + 800-weight h2. */
export function SectionHeading({
  subheading,
  title,
  intro,
  align = "center",
  light = false,
}: {
  subheading: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span className={cn("subheading", light && "text-white")}>{subheading}</span>
      <h2 className={cn("text-[28px] font-extrabold md:text-[30px]", light && "!text-white")}>{title}</h2>
      {intro && <p className={cn("mt-3 text-[15px]", light ? "text-white/80" : "text-body")}>{intro}</p>}
    </div>
  );
}
