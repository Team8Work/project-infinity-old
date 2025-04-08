import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface RoleBasedRouteProps {
  path: string;
  roles: string[];
  component: () => React.JSX.Element;
  fallbackPath?: string;
}

export function RoleBasedRoute({
  path,
  roles,
  component: Component,
  fallbackPath = "/",
}: RoleBasedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <Route path={path}>
        <Redirect to={fallbackPath} />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}