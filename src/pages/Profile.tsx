import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { generateChoreSchedule } from "@/lib/schedule";
import mhikeBg from "@/assets/mhike-bg.png";

// Define pairs: (name1, name2) share a schedule, (name3, name4) share a schedule.
const PAIRS = [
  { id: "pair-1", members: ["janjan", "cj"] },
  { id: "pair-2", members: ["mhike", "renier"] },
] as const;

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  // Start viewing the calendar on February 11, 2026
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 11));

  const normalizedName = name?.toLowerCase();

  // Pre-generate a full-year schedule for 2026, starting on February 11.
  // The schedule is generated per pair, so both members of a pair share the same duty days.
  const dutyDates = useMemo(() => {
    const pair = PAIRS.find((p) => p.members.includes(normalizedName || ""));
    if (!pair) {
      return new Set<string>();
    }

    const schedule = generateChoreSchedule(
      PAIRS.map((p) => p.id),
      new Date(2026, 1, 11),
      new Date(2026, 11, 31),
    );

    const myDates = new Set<string>();

    for (const entry of schedule) {
      if (entry.name === pair.id) {
        // Use ISO date string without time for stable comparison.
        myDates.add(entry.date.toISOString().slice(0, 10));
      }
    }

    return myDates;
  }, [normalizedName]);

  const isPairedName = useMemo(
    () => PAIRS.some((p) => p.members.includes(normalizedName || "")),
    [normalizedName],
  );

  const isDutyDay =
    !!date && dutyDates.has(new Date(date).toISOString().slice(0, 10));

  const isMhike = normalizedName === "mhike";

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background bg-cover bg-center"
      style={isMhike ? { backgroundImage: `url(${mhikeBg})` } : undefined}
    >
      <h1 className="text-2xl font-bold text-foreground">{name?.toUpperCase()}'s Calendar</h1>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 1)}
        className="rounded-md border pointer-events-auto"
        modifiers={{
          duty: Array.from(dutyDates).map((iso) => new Date(iso)),
        }}
        modifiersClassNames={{
          duty:
            "bg-emerald-500 text-emerald-950 hover:bg-emerald-500 hover:text-emerald-950 focus:bg-emerald-500 focus:text-emerald-950",
        }}
      />
      {isPairedName && date && (
        <div className="w-full max-w-sm rounded-md border p-4 text-center space-y-2">
          <p className="text-lg font-bold">
            {isDutyDay ? "IYUGIP MO" : "MANAGLUTO"}
          </p>
          <p className="text-xs text-muted-foreground">
            {date.toDateString()}
          </p>
        </div>
      )}
      <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
    </div>
  );
};

export default Profile;
