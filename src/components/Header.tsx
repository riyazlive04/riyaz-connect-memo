
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
    <header className="bg-card/95 backdrop-blur-sm border-b border-primary/20 shadow-glow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow hover:shadow-glow transition-all duration-300 hover:scale-110 animate-glow-pulse">
              <span className="text-white font-bold text-lg text-glow">M</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text-glow interactive-glow pulse-glow">
              MeetingMaster
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/70 w-4 h-4 group-hover:text-primary transition-colors" />
            <Input 
              placeholder="Search meetings, tasks..." 
              className="pl-10 w-80 bg-muted/30 border-primary/20 focus:bg-background focus:border-primary focus:shadow-glow transition-all duration-300 hover:border-primary/40"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-primary/10 hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Button for Mobile */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-primary/10 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-primary/10 transition-all duration-300 group hover:shadow-glow">
            <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-primary rounded-full text-xs flex items-center justify-center text-white font-medium animate-pulse shadow-glow">
              3
            </span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-all duration-300 group hover:shadow-glow">
                <div className="w-8 h-8 bg-gradient-primary/20 rounded-full flex items-center justify-center mr-2 group-hover:bg-gradient-primary/30 transition-colors group-hover:shadow-glow">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline font-medium text-glow group-hover:text-primary transition-colors">John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card-glow border-0 shadow-glow">
              <div className="px-3 py-2 border-b border-primary/20">
                <p className="text-sm font-medium gradient-text">John Doe</p>
                <p className="text-xs text-muted-foreground">john@company.com</p>
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors group">
                <User className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors group">
                <Settings className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">Settings</span>
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
