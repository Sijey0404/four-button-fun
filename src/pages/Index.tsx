import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Button size="lg">JANJAN</Button>
          <Button size="lg" variant="secondary">CJ</Button>
          <Button size="lg" variant="outline">MHIKE</Button>
          <Button size="lg" variant="destructive">RENIER</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
