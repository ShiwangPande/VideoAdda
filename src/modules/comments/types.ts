import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type CommentsoGetOManyOutput=
    inferRouterOutputs<AppRouter>["comments"]["getMany"];