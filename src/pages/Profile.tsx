import { useParams } from "react-router-dom";

const Profile = () => {
  const { name } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-foreground">Hi {name}</h1>
    </div>
  );
};

export default Profile;
