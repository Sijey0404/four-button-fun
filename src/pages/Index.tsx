import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Button size="lg">Button 1</Button>
          <Button size="lg" variant="secondary">Button 2</Button>
          <Button size="lg" variant="outline">Button 3</Button>
          <Button size="lg" variant="destructive">Button 4</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
