import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}


export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery({
    limit: DEFAULT_LIMIT,
    videoId,
  },{
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!videoId && open,
  });

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({videoId});
      utils.playlists.getOne.invalidate({id: data.playlistId});
      utils.playlists.getVideos.invalidate({playlistId: data.playlistId});
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({videoId});
      utils.playlists.getOne.invalidate({id: data.playlistId});
      utils.playlists.getVideos.invalidate({playlistId: data.playlistId});
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
      
    >
      <div className="flex flex-col gap-2"  onClick={(e) => e.stopPropagation()} >
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="animate-spin size-5 text-muted-foreground"/>
          </div>
        )}
        {!isLoading && 
          playlists?.pages
            .flatMap((page)=> page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.containsVideo) {
                    removeVideo.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addVideo.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  }
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
                >
                  {playlist.containsVideo ? (
                    <SquareCheckIcon className="mr-2 text-green-500"/>
                  ) : (
                    <SquareIcon className="mr-2" />
                  )}
                {playlist.name}
                </Button>
            ))
        }
        {!isLoading && (
          <InfiniteScroll 
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
         
          />
        )}
      </div>
    </ResponsiveModal>
  );
};
