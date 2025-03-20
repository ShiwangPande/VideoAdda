import {createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { usersRouter } from '@/modules/users/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videoRouters } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { SubscriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { searchoRouter } from '@/modules/search/server/procedures';
import { playlistsRouters } from '@/modules/playlists/server/procedures';

export const appRouter = createTRPCRouter({
    users: usersRouter,
    studio: studioRouter,
    videos: videoRouters,
    search: searchoRouter,
    comments: commentsRouter,
    playlists: playlistsRouters,
    categories: categoriesRouter,
    videoViews: videoViewsRouter,
    subscriptions: SubscriptionsRouter,
    videoReactions: videoReactionsRouter,
    commentReactions: commentReactionsRouter,
    suggestions: suggestionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;