import { useQuery } from "@tanstack/react-query";
import { checkApiHealth } from "./health.service";

/**
 * Hook for checking API health status
 */
export const useCheckApiHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: checkApiHealth,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};