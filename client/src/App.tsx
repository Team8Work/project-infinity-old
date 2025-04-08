import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Shipments from "@/pages/shipments";
import Tasks from "@/pages/tasks";
import Finances from "@/pages/finances";
import Tracking from "@/pages/tracking";
import History from "@/pages/history";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/shipments" component={Shipments} />
      <ProtectedRoute path="/tasks" component={Tasks} />
      <ProtectedRoute path="/finances" component={Finances} />
      <ProtectedRoute path="/tracking" component={Tracking} />
      <ProtectedRoute path="/history" component={History} />
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
    </>
  );
}

export default App;
