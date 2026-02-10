import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { generateChoreSchedule } from "@/lib/schedule";

// Define pairs: (name1, name2) share a schedule, (name3, name4) share a schedule.
const PAIRS = [
  { id: "pair-1", members: ["janjan", "cj"] },
  { id: "pair-2", members: ["mhike", "renier"] },
] as const;

const CHORE_MANAGLUTO = "MANAGLUTO";
const CHORE_MANAGSINOP = "MANAGSINOP";

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  // Start viewing the calendar on February 11, 2026
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 11));
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  const normalizedName = name?.toLowerCase();

  // Pre-generate a full-year schedule for 2026, starting on February 11.
  // The schedule is generated per pair, so both members of a pair share the same duty days,
  // but each member alternates their specific chore (MANAGLUTO / MANAGSINOP).
  const { dutyDates, choreByDate } = useMemo(() => {
    const empty = { dutyDates: new Set<string>(), choreByDate: new Map<string, string>() };

    if (!normalizedName) return empty;

    const pair = PAIRS.find((p) => p.members.includes(normalizedName));
    if (!pair) {
      return empty;
    }

    const schedule = generateChoreSchedule(
      PAIRS.map((p) => p.id),
      new Date(2026, 1, 11),
      new Date(2026, 11, 31),
    );

    const dutyDatesSet = new Set<string>();
    const choreMap = new Map<string, string>();

    const memberIndex = pair.members.indexOf(normalizedName);

    // Extract all duty days for this pair in order, then alternate chores per duty index.
    const pairEntries = schedule.filter((entry) => entry.name === pair.id);

    pairEntries.forEach((entry, index) => {
      const iso = entry.date.toISOString().slice(0, 10);
      dutyDatesSet.add(iso);

      if (memberIndex === 0) {
        // First member of the pair: starts as MANAGLUTO then alternates.
        choreMap.set(iso, index % 2 === 0 ? CHORE_MANAGLUTO : CHORE_MANAGSINOP);
      } else if (memberIndex === 1) {
        // Second member of the pair: starts as MANAGSINOP then alternates.
        choreMap.set(iso, index % 2 === 0 ? CHORE_MANAGSINOP : CHORE_MANAGLUTO);
      }
    });

    return { dutyDates: dutyDatesSet, choreByDate: choreMap };
  }, [normalizedName]);

  const activeDate = hoveredDate ?? date;
  const activeIso = activeDate ? new Date(activeDate).toISOString().slice(0, 10) : undefined;
  const activeChore = activeIso ? choreByDate.get(activeIso) : undefined;

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
        onDayClick={(day) => {
          setDate(day);
          setHoveredDate(undefined);
        }}
        onDayMouseEnter={(day) => {
          setHoveredDate(day);
        }}
        onDayMouseLeave={() => {
          setHoveredDate(undefined);
        }}
      />
      {activeChore && (
        <p className="text-sm font-semibold text-emerald-700">
          {activeChore}
        </p>
      )}
      <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
    </div>
  );
};

export default Profile;
