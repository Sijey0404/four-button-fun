export type ChoreAssignment = {
  date: Date;
  name: string;
};

/**
 * Generate a fair round-robin schedule where each name
 * is responsible for both cooking and dishes on their day.
 *
 * The algorithm walks through each day in the range and
 * cycles through the names array in order.
 */
export function generateChoreSchedule(
  names: string[],
  startDate: Date,
  endDate: Date,
): ChoreAssignment[] {
  if (names.length === 0) return [];

  // Ensure we work on copies so callers' dates are not mutated.
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return [];

  const schedule: ChoreAssignment[] = [];
  const current = new Date(start);
  let idx = 0;

  while (current <= end) {
    schedule.push({
      date: new Date(current),
      name: names[idx],
    });

    idx = (idx + 1) % names.length;
    current.setDate(current.getDate() + 1);
  }

  return schedule;
}

