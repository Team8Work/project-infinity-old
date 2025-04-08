import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function DebugLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Login successful',
        description: `Logged in as ${data.username}`,
      });
      queryClient.setQueryData(['/api/user'], data);
      navigate('/');
      setShowForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string; email: string; fullName: string; role: string }) => {
      const res = await apiRequest('POST', '/api/register', credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Registration successful',
        description: `Created user ${data.username}`,
      });
      queryClient.setQueryData(['/api/user'], data);
      navigate('/');
      setShowForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ username, password });
  };

  const handleRegister = () => {
    registerMutation.mutate({
      username,
      password,
      email: `${username}@example.com`,
      fullName: username,
      role: 'admin',
    });
  };

  const handleQuickLogin = () => {
    loginMutation.mutate({ username: 'Sameers1', password: 'password123' });
  };

  if (!showForm) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="default" 
          size="sm" 
          className="opacity-70 hover:opacity-100"
          onClick={() => setShowForm(true)}
        >
          Debug Login
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="ml-2 opacity-70 hover:opacity-100 bg-green-600"
          onClick={handleQuickLogin}
        >
          Quick Login
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Debug Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
          <div>
            <Button 
              variant="default" 
              size="sm" 
              className="mr-2"
              onClick={handleLogin}
              disabled={loginMutation.isPending}
            >
              Login
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleRegister}
              disabled={registerMutation.isPending}
            >
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}