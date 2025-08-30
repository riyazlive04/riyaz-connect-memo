
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
  Globe,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp
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
      description: "AI-powered audio/video transcription with 99%+ accuracy",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "Auto MoM Generation",
      description: "Structured meeting minutes generated in seconds",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Task Assignment",
      description: "Smart task detection with automatic owner assignment",
      color: "text-purple-500"
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Contextual follow-ups via email and Teams",
      color: "text-orange-500"
    }
  ];

  const benefits = [
    { icon: Clock, text: "Save 2+ hours per week on meeting documentation", metric: "2hrs" },
    { icon: TrendingUp, text: "Reduce task follow-up overhead by 80%", metric: "80%" },
    { icon: CheckCircle2, text: "Improve team accountability and transparency", metric: "100%" },
    { icon: Shield, text: "Centralized dashboard for all meeting outcomes", metric: "∞" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-large animate-scale-in">
                <span className="text-white font-bold text-3xl">M</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to <span className="gradient-text animate-slide-in">MeetingMaster</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your meetings into actionable insights with AI-powered transcription, 
            automated task assignments, and seamless follow-ups.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-4 py-2 text-sm hover:bg-success/20 transition-colors">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Enterprise Ready
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm hover:bg-accent/20 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm hover:bg-primary/20 transition-colors">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="btn-primary px-8 py-6 text-lg h-auto group shadow-large hover:shadow-xl transition-all duration-300"
              onClick={handleMSTeamsLogin}
            >
              <Globe className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg h-auto border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto mb-20">
          <Card className="card-shadow animate-fade-in glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl mb-2">Sign In to Continue</CardTitle>
              <CardDescription className="text-base">
                Choose your preferred platform to access your meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full btn-primary flex items-center space-x-3 h-14 text-base group shadow-medium hover:shadow-large transition-all duration-300"
                onClick={handleMSTeamsLogin}
              >
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <span>Continue with Microsoft Teams</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center space-x-3 h-14 text-base border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 group transition-all duration-300"
                onClick={handleGmailLogin}
              >
                <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>Continue with Gmail</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-6 px-4">
                By signing in, you agree to our{" "}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover text-center animate-slide-in glass-card border-0 shadow-soft hover:shadow-large group transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="card-shadow max-w-5xl mx-auto animate-fade-in glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4 gradient-text">Why Choose MeetingMaster?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of teams who've streamlined their meeting workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-success/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-medium group-hover:text-primary transition-colors">
                      {benefit.text}
                    </span>
                    <div className="text-2xl font-bold text-primary mt-1">
                      {benefit.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <Button 
                size="lg" 
                className="btn-primary px-12 py-6 text-lg h-auto group shadow-large hover:shadow-xl transition-all duration-300"
                onClick={handleMSTeamsLogin}
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
