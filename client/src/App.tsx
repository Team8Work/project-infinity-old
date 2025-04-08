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
    // No need to handle root route as it's already handled by RoleBasedDashboard
    
    // Redirect from users page if not admin
    if (user && location === "/users" && user.role !== "admin") {
      setLocation("/");
    }
    
    // Redirect from tasks page if employee
    else if (user && location === "/tasks" && user.role === "employee") {
      setLocation("/");
    }
    
    // Hide settings pages from non-admins (if we add these in the future)
    else if (user && location.startsWith("/settings") && user.role !== "admin") {
      setLocation("/");
    }
    
    // Add any other role-specific redirects here
  }, [user, location, setLocation]);

  return (
    <Switch>
      {/* Dashboard - role-specific display handled by RoleBasedDashboard */}
      <ProtectedRoute path="/" component={RoleBasedDashboard} />
      
      {/* Common routes for all authenticated users */}
      <ProtectedRoute path="/shipments" component={Shipments} />
      <ProtectedRoute path="/tracking" component={Tracking} />
      <ProtectedRoute path="/payments" component={Finances} />
      <ProtectedRoute path="/history" component={History} />
      
      {/* Role-specific routes */}
      <RoleBasedRoute 
        path="/tasks" 
        roles={["admin", "manager"]} 
        component={Tasks} 
        fallbackPath="/"
      />
      
      <RoleBasedRoute 
        path="/users" 
        roles={["admin"]} 
        component={Users}
        fallbackPath="/"
      />
      
      {/* Authentication and fallbacks */}
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
