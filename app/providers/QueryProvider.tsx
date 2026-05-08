"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient} from "../hooks/queryclient";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = queryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}