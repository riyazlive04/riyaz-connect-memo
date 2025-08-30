
import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  // In real app, this would check authentication status from Supabase
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
