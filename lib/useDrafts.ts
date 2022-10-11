import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Proposal } from "@prisma/client";

export function useDrafts() {
  const { data: drafts, isLoading } = useQuery(["drafts"], async () => {
    const response = await axios.get<Proposal[]>("/api/drafts");
    console.log('🚀 ~ file: useDraftProposals.ts ~ response', response);
    return response.data;
  });
  return { drafts, isLoading };
}
