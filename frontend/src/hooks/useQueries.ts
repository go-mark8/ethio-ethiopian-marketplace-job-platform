import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, Job, UserProfile, ProductCategory, JobCategory, Message, ConversationPreview } from '../types';
import type { ProductCreationData } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
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

export function useRegisterUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; email: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.registerUserProfile(params.name, params.email, params.phone);
      if (!result) {
        throw new Error('Failed to register user profile');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
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

// Home/Discover Queries
export function useGetHomeDiscover() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['homeDiscover'],
    queryFn: async () => {
      if (!actor) return { featuredProducts: [], categories: [] };
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getHomeDiscover !== 'function') {
        return { featuredProducts: [], categories: [] };
      }
      // @ts-ignore
      return actor.getHomeDiscover();
    },
    enabled: !!actor && !isFetching,
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopViewedProducts(limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['topViewedProducts', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopViewedProducts(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementProductViews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementProductViews(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topViewedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSearchProducts(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchText],
    queryFn: async () => {
      if (!actor || !searchText) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.searchProducts !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.searchProducts(searchText);
    },
    enabled: !!actor && !isFetching && searchText.length > 0,
  });
}

export function useGetProductsByCategory(category: ProductCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getProductsByCategory !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductCreationData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['homeDiscover'] });
      queryClient.invalidateQueries({ queryKey: ['callerProducts'] });
      queryClient.invalidateQueries({ queryKey: ['topViewedProducts'] });
    },
  });
}

// Favorites Queries
export function useGetUserFavorites() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Product[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getUserFavorites !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getUserFavorites();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.addFavorite !== 'function') {
        throw new Error('Backend method not implemented');
      }
      // @ts-ignore
      return actor.addFavorite(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.removeFavorite !== 'function') {
        throw new Error('Backend method not implemented');
      }
      // @ts-ignore
      return actor.removeFavorite(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Seller Listings Queries
export function useGetCallerProducts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Product[]>({
    queryKey: ['callerProducts'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getProductsBySeller(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetSellerProducts(sellerId: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['sellerProducts', sellerId?.toString()],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getProductsBySeller(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.deleteProduct !== 'function') {
        throw new Error('Backend method not implemented');
      }
      // @ts-ignore
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['callerProducts'] });
      queryClient.invalidateQueries({ queryKey: ['homeDiscover'] });
      queryClient.invalidateQueries({ queryKey: ['topViewedProducts'] });
    },
  });
}

// Messaging Queries
export function useGetConversations() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ConversationPreview[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getConversations !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetConversation(otherUserId: Principal | null) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Message[]>({
    queryKey: ['conversation', otherUserId?.toString()],
    queryFn: async () => {
      if (!actor || !otherUserId) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getConversation !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getConversation(otherUserId);
    },
    enabled: !!actor && !isFetching && !!identity && !!otherUserId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { receiverId: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.sendMessage !== 'function') {
        throw new Error('Backend method not implemented');
      }
      // @ts-ignore
      return actor.sendMessage(params.receiverId, params.content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.receiverId.toString()] });
    },
  });
}

// Job Queries
export function useGetAllJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getAllJobs !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchJobs(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs', 'search', searchText],
    queryFn: async () => {
      if (!actor || !searchText) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.searchJobs !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.searchJobs(searchText);
    },
    enabled: !!actor && !isFetching && searchText.length > 0,
  });
}

export function useGetJobListings(location: string | null, category: JobCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs', 'listings', location, category],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.getJobListings !== 'function') {
        return [];
      }
      // @ts-ignore
      return actor.getJobListings(location, category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      description: string;
      location: string;
      company: string;
      category: JobCategory;
      salary: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (typeof actor.createJob !== 'function') {
        throw new Error('Backend method not implemented');
      }
      // @ts-ignore
      return actor.createJob(
        params.id,
        params.title,
        params.description,
        params.location,
        params.company,
        params.category,
        params.salary
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
