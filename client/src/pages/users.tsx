import { useQuery, useMutation } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { User, InsertUser } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw, Trash, UserPlus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function generateRandomUsername() {
  const prefix = "user";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}

function generateRandomPassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}

export default function Users() {
  const { toast } = useToast();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newUserRole, setNewUserRole] = useState<string>("employee");
  const [generatedCredentials, setGeneratedCredentials] = useState<{ username: string; password: string } | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const handleCreateUser = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      // Generate random username and password
      const username = generateRandomUsername();
      const password = generateRandomPassword();

      const newUser: InsertUser = {
        username,
        password,
        email: `${username}@example.com`,
        fullName: username,
        role: newUserRole,
        company: "LogiTrack"
      };

      await apiRequest("POST", "/api/users", newUser);
      
      // Store the generated credentials to show to admin
      setGeneratedCredentials({ username, password });
      
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "User created successfully",
        description: "New user account has been created",
      });
    } catch (error) {
      toast({
        title: "Failed to create user",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/users/${selectedUser.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "User deleted",
        description: `${selectedUser.username} has been removed`,
      });
      
      setSelectedUser(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setGeneratedCredentials(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 hover:bg-red-600";
      case "manager":
        return "bg-blue-500 hover:bg-blue-600";
      case "employee":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => setCreateModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create New Account
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Manage employee and manager accounts for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.company || "-"}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => confirmDelete(user)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create New Account Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              {!generatedCredentials 
                ? "Create a new account for your team member. Select their role and system access."
                : "Account created successfully. Share these credentials with the user."}
            </DialogDescription>
          </DialogHeader>
          
          {!generatedCredentials ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUserRole}
                    onValueChange={setNewUserRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeCreateModal}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  disabled={isCreating}
                >
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Account
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-2 border p-4 rounded-md bg-muted/50">
                  <div className="space-y-1">
                    <Label>Username</Label>
                    <div className="flex items-center justify-between">
                      <code className="bg-background p-1 rounded text-sm font-mono">
                        {generatedCredentials.username}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <Label>Password</Label>
                    <div className="flex items-center justify-between">
                      <code className="bg-background p-1 rounded text-sm font-mono">
                        {generatedCredentials.password}
                      </code>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Please save these credentials securely. You won't be able to view the password again.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeCreateModal}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{" "}
              <strong>{selectedUser?.username}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}