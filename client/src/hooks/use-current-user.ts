import { useQuery } from '@tanstack/react-query';

export interface CurrentUser {
  _id: string;
  email: string;
  name?: string;
  role: 'admin' | 'trainer' | 'client';
  clientId?: string;
}

export function useCurrentUser() {
  return useQuery<{ user: CurrentUser }>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
