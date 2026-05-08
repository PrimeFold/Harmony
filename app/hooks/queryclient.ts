import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const queryClient = ()=>{
    const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Keep data fresh for 1 minute
      },
    },
  }));
  return queryClient;
}