import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { generateChoreSchedule } from "@/lib/schedule";

const HOUSEHOLD_NAMES = ["janjan", "cj", "mhike", "renier"] as const;

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 10));

  const normalizedName = name?.toLowerCase();

  // Pre-generate a full-year schedule for 2026.
  const dutyDates = useMemo(() => {
    if (!normalizedName || !HOUSEHOLD_NAMES.includes(normalizedName as (typeof HOUSEHOLD_NAMES)[number])) {
      return new Set<string>();
    }

    const schedule = generateChoreSchedule(
      HOUSEHOLD_NAMES as unknown as string[],
      new Date(2026, 0, 1),
      new Date(2026, 11, 31),
    );

    const myDates = new Set<string>();

    for (const entry of schedule) {
      if (entry.name === normalizedName) {
        // Use ISO date string without time for stable comparison.
        myDates.add(entry.date.toISOString().slice(0, 10));
      }
    }

    return myDates;
  }, [normalizedName]);

  const selectedIsDutyDay =
    !!date && dutyDates.has(new Date(date).toISOString().slice(0, 10));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
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
      <p className="text-sm text-muted-foreground">
        {selectedIsDutyDay
          ? "This is your day to cook and do the dishes."
          : "You are free from cooking and dishes on this day."}
      </p>
      <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
    </div>
  );
};

export default Profile;
