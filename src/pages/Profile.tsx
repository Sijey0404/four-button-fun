import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { generateChoreSchedule } from "@/lib/schedule";
import mhikeBg from "@/assets/mhike-bg.png";
import renierBg from "@/assets/renier-bg.png";

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
  // We also track:
  // - dutyDates: all Date objects where this pair has chores (for coloring the calendar)
  // - indexByDate: the index (0, 1, 2, ...) of each duty date per pair, so we can
  //   alternate messages between "MANAGLUTO" and "MANAGURAS".
  const dutyInfo = useMemo(() => {
    const pair = PAIRS.find((p) => p.members.includes(normalizedName || ""));
    if (!pair) {
      return { pair: undefined, indexByDate: new Map<string, number>(), dutyDates: [] as Date[] };
    }

    const schedule = generateChoreSchedule(
      PAIRS.map((p) => p.id),
      new Date(2026, 1, 11),
      new Date(2026, 11, 31),
    );

    const indexByDate = new Map<string, number>();
    const dutyDates: Date[] = [];
    let dutyIndex = 0;

    for (const entry of schedule) {
      if (entry.name === pair.id) {
        const iso = entry.date.toISOString().slice(0, 10);
        indexByDate.set(iso, dutyIndex);
        dutyDates.push(new Date(entry.date));
        dutyIndex += 1;
      }
    }

    return { pair, indexByDate, dutyDates };
  }, [normalizedName]);

  const isPairedName = !!dutyInfo.pair;

  const selectedIso = date ? new Date(date).toISOString().slice(0, 10) : undefined;
  const dutyIndex = selectedIso ? dutyInfo.indexByDate.get(selectedIso) : undefined;
  const isDutyDay = dutyIndex !== undefined;

  const isMhike = normalizedName === "mhike";
  const isRenier = normalizedName === "renier";

  // Determine the message shown for the selected date.
  // For each pair:
  // - On their shared duty days (index 0, 1, 2, ... for that pair):
  //   - Even index (0, 2, 4, ...):
  //       first member  -> "MANAGLUTO"
  //       second member -> "MANAGURAS"
  //   - Odd index (1, 3, 5, ...):
  //       first member  -> "MANAGURAS"
  //       second member -> "MANAGLUTO"
  // - On a non-duty day for that pair: "IYUGIP MO"
  const choreMessage = (() => {
    if (!date || !dutyInfo.pair || !normalizedName) return null;

    const memberIndex = dutyInfo.pair.members.indexOf(normalizedName);
    if (memberIndex === -1) return null;

    if (!isDutyDay || dutyIndex === undefined) {
      return "IYUGIP MO";
    }

    const isEvenDutyIndex = dutyIndex % 2 === 0;

    if (isEvenDutyIndex) {
      return memberIndex === 0 ? "MANAGLUTO" : "MANAGURAS";
    }

    // Odd duty index: swap roles
    return memberIndex === 0 ? "MANAGURAS" : "MANAGLUTO";
  })();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-4">
        {isMhike && (
          <img
            src={mhikeBg}
            alt="Mhike"
            className="h-16 w-16 rounded-full object-cover border-2 border-primary"
          />
        )}
        {isRenier && (
          <img
            src={renierBg}
            alt="Renier"
            className="h-16 w-16 rounded-full object-cover border-2 border-primary"
          />
        )}
        <h1 className="text-2xl font-bold text-foreground">{name?.toUpperCase()}'s Calendar</h1>
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 1)}
        className="rounded-md border pointer-events-auto"
        modifiers={{
          duty: dutyInfo.dutyDates,
        }}
        modifiersClassNames={{
          duty:
            "bg-emerald-500 text-emerald-950 hover:bg-emerald-500 hover:text-emerald-950 focus:bg-emerald-500 focus:text-emerald-950",
        }}
      />
      {choreMessage && date && (
        <div className="w-full max-w-sm rounded-md border p-4 text-center space-y-2">
          <p className="text-lg font-bold">
            {choreMessage}
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
