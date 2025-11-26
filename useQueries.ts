import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Area, UserProfile, UserData, UserPreferences, Recommendation } from '../backend';

export function useGetAllAreas() {
  const { actor, isFetching } = useActor();

  return useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAreas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAreaByName(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Area | null>({
    queryKey: ['area', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAreaByName(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetPersonalizedGreeting() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['personalizedGreeting'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getPersonalizedGreeting();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserData() {
  const { actor, isFetching } = useActor();

  return useQuery<UserData | null>({
    queryKey: ['userData'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserData();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSaveUserData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      preferences,
      recommendations,
    }: {
      preferences: UserPreferences;
      recommendations: Recommendation[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveUserData(preferences, recommendations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useGetRecommendations() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      if (!actor) throw new Error('Backend not initialized');
      return actor.getRecommendations(preferences);
    },
  });
}
