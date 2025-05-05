
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  User,
  HelpCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const AdminHeader = () => {
  return (
    <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white">
          Kanny<span className="text-kannyflix-green">Flix</span> Admin
        </h1>
        <div className="hidden md:block relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="bg-zinc-900 border-zinc-800 pl-8"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Video Tutorials</DropdownMenuItem>
            <DropdownMenuItem>FAQ</DropdownMenuItem>
            <DropdownMenuItem>Contact Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start">
              <p className="font-medium">New content upload complete</p>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start">
              <p className="font-medium">Ad campaign ended</p>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start">
              <p className="font-medium">System update available</p>
              <span className="text-xs text-muted-foreground">Yesterday</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/">Exit Admin</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminHeader;
