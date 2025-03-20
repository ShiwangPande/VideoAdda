import Link from "next/link";
import { CommentsoGetOManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon, ChevronUpIcon, ChevronDownIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment.replies";

interface CommentItemProps {
    comment: CommentsoGetOManyOutput["items"][number];
    variant?: "reply" | "comment",
}


const getTimeFormat = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);

    const minutesDiff = differenceInMinutes(now, commentDate);
    const hoursDiff = differenceInHours(now, commentDate);
    const daysDiff = differenceInDays(now, commentDate);

    if (minutesDiff < 1) return "Just now";
    if (minutesDiff < 60) return `${minutesDiff} min${minutesDiff > 1 ? "s" : ""} ago`;
    if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
    if (daysDiff === 1) return "Yesterday";
    if (daysDiff < 7) return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} week${Math.floor(daysDiff / 7) > 1 ? "s" : ""} ago`;

    return formatDistanceToNow(commentDate, { addSuffix: true });
};
export const CommentItem = ({
    comment,
    variant = "comment",
}: CommentItemProps) => {

    const clerk = useClerk();
    const { userId } = useAuth();

    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);


    const [showFullText, setShowFullText] = useState(false);
    const isLongComment = comment.value.length > 300;
    const utils = trpc.useUtils();
    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted", {
                style: { backgroundColor: "#18181b", color: "white" },
                icon: <Trash2Icon className="text-red-500" />
            });
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Something went wrong", {
                style: { backgroundColor: "#18181b", color: "white" }
            });

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        },
    });

    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId })
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });
    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId })
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });


    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar
                        size={variant === "comment" ? "lg" : "sm"}
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {getTimeFormat(comment.createdAt)}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm text-foreground/90 mb-2">
                        {isLongComment ? (
                            <>
                                {showFullText ? comment.value : comment.value.substring(0, 300) + '...'}
                                <button
                                    onClick={toggleShowFullText}
                                    className="mt-2 text-primary/70 hover:text-primary/80 hover:underline font-medium flex items-center gap-1"
                                >
                                    {showFullText ? (
                                        <>
                                            Show less <ChevronUpIcon className="size-3" />
                                        </>
                                    ) : (
                                        <>
                                            Read more <ChevronDownIcon className="size-3" />
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            comment.value
                        )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                disabled={like.isPending}
                                size="icon"
                                className="size-8"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon className={cn(
                                    comment.viewerReactions === "like" && "fill-black"
                                )} />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {comment.likeCount}
                            </span>
                            <Button
                                variant="ghost"
                                disabled={dislike.isPending}
                                size="icon"
                                className="size-8"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon className={cn(
                                    comment.viewerReactions === "dislike" && "fill-black"
                                )} />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {comment.dislikeCount}
                            </span>
                        </div>
                        {variant === "comment" && (
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="h-8 rounded-3xl"
                                onClick={() => setIsReplyOpen(true)}
                            >
                                Reply
                            </Button>
                        )}
                    </div>
                </div>
                {comment.user.clerkId !== userId && variant =="comment" && (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                                <MessageSquareIcon className="size-4" />
                                Reply
                            </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                )}
            </div>
            {isReplyOpen && variant === "comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                    variant="reply"
                    parentId={comment.id}
                    onCancel={()=> setIsReplyOpen(false)}
                        videoId={comment.videoId}
                        onSuccses={() => {
                            setIsRepliesOpen(true);
                            setIsReplyOpen(false);
                        }}
                    />
                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && (
                <div className="pl-14">
                    <Button
                    variant={"tertiary"}
                        size={"sm"}
                        onClick={()=> setIsRepliesOpen((current) => !current)}
                    >
                        {isRepliesOpen ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                        {comment.replyCount} replies
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
                <CommentReplies 
                    parentId={comment.id}
                    videoId={comment.videoId}
                />
            )}
        </div>
    );
}