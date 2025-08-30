
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  FileText, 
  Users, 
  Mail, 
  CheckCircle2, 
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { toast } from "sonner";

const AuthPage = () => {
  const handleMSTeamsLogin = () => {
    toast.info("MS Teams OAuth will be available once backend is connected");
  };

  const handleGmailLogin = () => {
    toast.info("Gmail OAuth will be available once backend is connected");
  };

  const features = [
    {
      icon: Mic,
      title: "Smart Transcription",
      description: "AI-powered audio/video transcription with high accuracy"
    },
    {
      icon: FileText,
      title: "Auto MoM Generation",
      description: "Structured meeting minutes generated automatically"
    },
    {
      icon: Users,
      title: "Task Assignment",
      description: "Clear task assignments with owners and deadlines"
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Email and Teams follow-ups for task accountability"
    }
  ];

  const benefits = [
    "Save 2+ hours per week on meeting documentation",
    "Reduce task follow-up overhead by 80%",
    "Improve team accountability and transparency",
    "Centralized dashboard for all meeting outcomes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-large">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="gradient-text">MeetingMaster</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Transform your meetings into actionable insights with AI-powered transcription, 
            automated task assignments, and seamless follow-ups.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-success/10 text-success">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Enterprise Ready
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Zap className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="card-shadow animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in with your preferred platform to access your meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full btn-primary flex items-center space-x-3 h-12"
                onClick={handleMSTeamsLogin}
              >
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                  <Globe className="w-3 h-3 text-primary" />
                </div>
                <span>Continue with Microsoft Teams</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center space-x-3 h-12 hover:bg-primary hover:text-primary-foreground"
                onClick={handleGmailLogin}
              >
                <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                  <Mail className="w-3 h-3 text-white" />
                </div>
                <span>Continue with Gmail</span>
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover text-center animate-slide-in">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="card-shadow max-w-4xl mx-auto animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Why Choose MeetingMaster?</CardTitle>
            <CardDescription>
              Join thousands of teams who've streamlined their meeting workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
