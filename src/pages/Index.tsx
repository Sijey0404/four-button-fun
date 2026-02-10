import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import welcomeBg from "@/assets/welcome-bg.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${welcomeBg})` }}
    >
      <div className="text-center space-y-8 bg-black/50 px-6 py-8 rounded-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/janjan")}>JANJAN</Button>
          <Button size="lg" variant="secondary" onClick={() => navigate("/cj")}>CJ</Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/mhike")}>MHIKE</Button>
          <Button size="lg" variant="destructive" onClick={() => navigate("/renier")}>RENIER</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
