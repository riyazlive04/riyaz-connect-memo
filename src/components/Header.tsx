
import { Button } from "@/components/ui/button";
import { Bell, Settings, User, LogOut, Search, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border/50 card-shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">MeetingMaster</h1>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search meetings, tasks..." 
              className="pl-10 w-80 bg-muted/30 border-muted focus:bg-background transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Button for Mobile */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 transition-colors group">
            <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-white font-medium animate-pulse">
              3
            </span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-muted/50 transition-colors group">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 group-hover:bg-primary/20 transition-colors">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline font-medium">John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-0 shadow-large">
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@company.com</p>
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
