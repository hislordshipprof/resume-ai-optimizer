import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import type { LoginCredentials, RegisterData, User } from '@/types/api';

// Query Keys
export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
};

// Get current user query
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () => apiService.getCurrentUser(),
    retry: false, // Don't retry auth requests
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiService.login(credentials),
    onSuccess: async (data) => {
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
      
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterData) => apiService.register(data),
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. You can now sign in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      apiService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
  });
}