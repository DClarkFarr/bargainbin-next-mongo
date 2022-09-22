import { fetcher } from "@/lib/fetch";
import { Document } from "mongodb";
import useSWR from "swr";

export function useCurrentUser() {
    return useSWR<Document>("/api/user", fetcher);
}

export function useUser(id: string) {
    return useSWR(`/api/users/${id}`, fetcher);
}
