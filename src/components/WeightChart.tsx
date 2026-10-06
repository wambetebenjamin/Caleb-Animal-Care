"use client";

import { useReducedMotion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeightEntry } from "@/lib/types";

/** Pet weight log — line draws in from the left on tab load; instant under
 *  prefers-reduced-motion. */
export function WeightChart({ data }: { data: WeightEntry[] }) {
  const reduced = useReducedMotion();
  if (data.length < 2) {
    return (
      <p className="rounded-brand border border-dashed border-line p-4 text-[13px] text-body">
        Log at least two weight entries and the growth chart will draw itself here.
      </p>
    );
  }
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="h-64 w-full" role="img" aria-label={`Weight chart: ${sorted[0].kg} kg to ${sorted[sorted.length - 1].kg} kg`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sorted} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
          <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#808080" }} tickLine={false} axisLine={{ stroke: "#e6e6e6" }} />
          <YAxis unit=" kg" tick={{ fontSize: 11, fill: "#808080" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
          <Tooltip
            formatter={(value) => [`${value} kg`, "Weight"]}
            labelStyle={{ fontSize: 12, fontWeight: 700 }}
            contentStyle={{ borderRadius: 4, borderColor: "#e6e6e6", fontSize: 13 }}
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#00bd56"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#00bd56", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive={!reduced}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
