
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-kannyflix-background">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Oops! This page doesn't exist</p>
      
      <Button asChild className="bg-kannyflix-green hover:bg-kannyflix-green/90">
        <Link to="/" className="flex items-center">
          <Home size={18} className="mr-2" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
