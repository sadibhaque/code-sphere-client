import { useEffect, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Facebook,
    MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loading from "../../components/Loading";

export default function PostDetail() {
    const [post] = useState(useLoaderData());
    const { user } = useAuth();
    const [commentText, setCommentText] = useState("");
    const [currentUpvotes, setCurrentUpvotes] = useState(post.upvotes || 0);
    const [currentDownvotes, setCurrentDownvotes] = useState(
        post.downvotes || 0
    );
    const [userVote, setUserVote] = useState(null); // Tracks user's vote for this post
    const [commentsCount, setCommentsCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const fetchComments = async () => {
        if (!post?._id) return;

        try {
            setLoadingComments(true);
            const response = await axios.get(
                `http://localhost:3000/comments/${post._id}`
            );
            setComments(response.data);
            setCommentsCount(response.data.length);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post._id]);

    // Check user's current vote status when component loads
    useEffect(() => {
        if (user && post) {
            // Check if user has voted on this post
            if (post.upvotedBy?.includes(user.uid)) {
                setUserVote("up");
            } else if (post.downvotedBy?.includes(user.uid)) {
                setUserVote("down");
            } else {
                setUserVote(null);
            }
        }
    }, [user, post]);

    const handleCommentSubmit = async () => {
        if (!user) {
            toast.error("Please log in to comment.");
            return;
        }
        if (commentText.trim()) {
            try {
                const commentData = {
                    postId: post._id,
                    postTitle: post.title,
                    userId: user.uid,
                    userEmail: user.email,
                    userName: user.displayName,
                    userImage: user.photoURL,
                    text: commentText,
                    createdAt: new Date().toISOString(),
                };

                await axios.post("http://localhost:3000/comments", commentData);

                console.log(
                    `Comment on post ${post._id} by ${user.email}: ${commentText}`
                );
                setCommentText("");
                setCommentsCount((prev) => prev + 1);
                toast.success("Comment added successfully!");
                fetchComments(); // Refresh comments after adding a new one
            } catch (error) {
                console.error("Error posting comment:", error);
                toast.error("Failed to post comment. Please try again.");
            }
        }
    };

    const handleVote = async (type) => {
        if (!user) {
            toast.error("Please log in to vote.");
            return;
        }

        try {
            // Send vote to server
            const response = await axios.patch(
                `http://localhost:3000/posts/${post._id}/vote`,
                {
                    voteType: type,
                    userId: user.uid,
                }
            );

            // Update UI with server response
            setCurrentUpvotes(response.data.upvotes);
            setCurrentDownvotes(response.data.downvotes);

            // Update user vote state based on server response
            if (response.data.hasUpvoted) {
                setUserVote("up");
            } else if (response.data.hasDownvoted) {
                setUserVote("down");
            } else {
                setUserVote(null);
            }

            toast.success(response.data.message);
        } catch (error) {
            console.error(`Error voting ${type} on post:`, error);
            toast.error(`Failed to register your vote. Please try again.`);
        }
    };

    // We'll track votes only in client state as per requirement

    const handleShare = (platform) => {
        const shareUrl = `https://example.com/post/${post.id}`;
        const shareTitle = post.title;

        if (platform === "facebook") {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
            )}&quote=${encodeURIComponent(shareTitle)}`;
            window.open(facebookUrl, "_blank");
        } else if (platform === "whatsapp") {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                shareTitle + " " + shareUrl
            )}`;
            window.open(whatsappUrl, "_blank");
        } else if (platform === "copy") {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Link copied to clipboard!");
            });
        }
    };

    // const handleViewComments = () => {
    //     alert(`Viewing all ${commentsCount} comments for "${post.title}"`);
    //     // In a real app, this would navigate to a comments page
    // };

    // if (loadingComments) return <Loading></Loading>;
    return (
        <div className="max-w-4xl px-5 lg:px-0 mx-auto my-10">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={user?.photoURL || "/placeholder.svg"}
                                alt={user?.displayName}
                            />
                            <AvatarFallback>
                                {user?.displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-lg">
                                {user?.displayName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {post?.createdAt}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-3xl font-bold mb-4">
                        {post?.title}
                    </CardTitle>
                    <p className="text-muted-foreground whitespace-pre-wrap mb-6">
                        {post?.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post?.tagList.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote("up")}
                            className={userVote === "up" ? "text-primary" : ""}
                            disabled={!user}
                        >
                            <ThumbsUp className="h-5 w-5 mr-1" />{" "}
                            {currentUpvotes}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote("down")}
                            className={
                                userVote === "down" ? "text-destructive" : ""
                            }
                            disabled={!user}
                        >
                            <ThumbsDown className="h-5 w-5 mr-1" />{" "}
                            {currentDownvotes}
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!user}>
                            <MessageCircle className="h-5 w-5 mr-1" />{" "}
                            {commentsCount}
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!user}
                            >
                                <Share2 className="h-4 w-4 mr-1" /> Share
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleShare("facebook")}
                            >
                                <Facebook className="h-4 w-4 mr-2" /> Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleShare("whatsapp")}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />{" "}
                                WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleShare("copy")}
                            >
                                <Share2 className="h-4 w-4 mr-2" /> Copy Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={!user}
                    />
                    <Button onClick={handleCommentSubmit} disabled={!user}>
                        Comment
                    </Button>
                </div>
                {/* Button to view all comments */}
                <Dialog
                    onOpenChange={(open) => {
                        if (open) fetchComments();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button variant="link" className="text-sm p-0 h-auto">
                            View all {commentsCount} comments
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Comments on "{post.title}"
                            </DialogTitle>
                            <DialogDescription>
                                Comments for this post
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 space-y-4">
                            {loadingComments ? (
                                <div className="text-center py-6">
                                    Loading comments...
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    No comments yet
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="border-b pb-3"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        comment.userImage ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={comment.userName}
                                                />
                                                <AvatarFallback>
                                                    {comment.userName?.charAt(
                                                        0
                                                    ) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {comment.userName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        comment.createdAt
                                                    ).toLocaleString("en-US", {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <p className="text-sm pl-10">
                                                {comment.text}
                                            </p>
                                            <Link
                                                to={`/comment-report/${comment._id}`}
                                                onClick={() => {
                                                    console.log(comment._id);
                                                }}
                                                className="text-xs text-muted-foreground underline"
                                            >
                                                Report Comment
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
