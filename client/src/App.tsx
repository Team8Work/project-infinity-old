import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import EmployeeDashboard from "@/pages/employee-dashboard";
import Shipments from "@/pages/shipments";
import Tasks from "@/pages/tasks";
import Finances from "@/pages/finances";
import Tracking from "@/pages/tracking";
import History from "@/pages/history";
import Users from "@/pages/users";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/admin-route";
import { RoleBasedRoute } from "@/lib/role-based-route";
import { DebugLogin } from "@/components/debug-login";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function RoleBasedDashboard() {
  const { user } = useAuth();
  
  if (user?.role === "employee") {
    return <EmployeeDashboard />;
  }
  
  // Admin and manager get the standard dashboard
  return <Dashboard />;
}

function Router() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Redirect users to appropriate views based on their role when they access protected routes
  useEffect(() => {
    if (user && location === "/") {
      // Already handled by the RoleBasedDashboard component
    } else if (user && location === "/users" && user.role !== "admin") {
      setLocation("/");
    } else if (user && location === "/tasks" && user.role === "employee") {
      // Employees don't need task management page, as it's handled in their dashboard
      setLocation("/");
    }
  }, [user, location, setLocation]);

  return (
    <Switch>
      <ProtectedRoute path="/" component={RoleBasedDashboard} />
      <ProtectedRoute path="/shipments" component={Shipments} />
      <RoleBasedRoute 
        path="/tasks" 
        roles={["admin", "manager"]} 
        component={Tasks} 
      />
      <ProtectedRoute path="/finances" component={Finances} />
      <ProtectedRoute path="/tracking" component={Tracking} />
      <ProtectedRoute path="/history" component={History} />
      <AdminRoute path="/users" component={Users} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
      <DebugLogin />
    </>
  );
}

export default App;
