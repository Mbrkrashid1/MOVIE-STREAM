
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye, Pencil, Trash2 } from "lucide-react";

// Mock data for demonstration
const usersData = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    joinDate: "Jan 15, 2023"
  },
  {
    id: "2",
    name: "Fatima Ibrahim",
    email: "fatima@example.com",
    role: "user",
    status: "active",
    lastActive: "5 days ago",
    joinDate: "Mar 22, 2023"
  },
  {
    id: "3",
    name: "Malik Johnson",
    email: "malik@example.com",
    role: "editor",
    status: "inactive",
    lastActive: "2 weeks ago",
    joinDate: "Sep 10, 2023"
  },
  {
    id: "4",
    name: "Zainab Ahmed",
    email: "zainab@example.com",
    role: "user",
    status: "active",
    lastActive: "1 day ago",
    joinDate: "Dec 5, 2023"
  },
  {
    id: "5",
    name: "Ibrahim Musa",
    email: "ibrahim@example.com",
    role: "user",
    status: "suspended",
    lastActive: "1 month ago",
    joinDate: "Aug 18, 2023"
  }
];

const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = usersData.filter(
    user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `User status changed to ${newStatus}.`
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User Deleted",
      description: "User has been successfully removed."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter details to create a new user account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Add user form fields here */}
                <p className="text-center text-muted-foreground">
                  User creation form would go here
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableCaption>List of platform users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.status === "active" ? "success" : 
                        user.status === "inactive" ? "secondary" :
                        "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
