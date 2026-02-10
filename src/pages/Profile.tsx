import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 10));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-2xl font-bold text-foreground">{name?.toUpperCase()}'s Calendar</h1>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 1)}
        className="rounded-md border pointer-events-auto"
      />
      <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
    </div>
  );
};

export default Profile;
