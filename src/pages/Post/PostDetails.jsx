import { useContext, useEffect, useState } from "react";
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
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function PostDetail() {
    const [post] = useState(useLoaderData());
    const { user } = useAuth;
    const [commentText, setCommentText] = useState("");
    const [currentUpvotes, setCurrentUpvotes] = useState(post.upvotes);
    const [currentDownvotes, setCurrentDownvotes] = useState(post.downvotes);
    const [userVote, setUserVote] = useState(null); // Tracks user's vote for this post
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);

    console.log(post);

    const handleCommentSubmit = () => {
        if (!user) {
            alert("Please log in to comment.");
            return;
        }
        if (commentText.trim()) {
            console.log(
                `Comment on post ${post.id} by ${user.email}: ${commentText}`
            );
            alert("Comment submitted successfully!");
            setCommentText("");
            setCommentsCount((prev) => prev + 1);
            // In a real app, this would send comment to backend and update comments count
        }
    };

    const handleVote = (type) => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }

        if (type === "up") {
            if (userVote === "up") {
                // User un-upvoted
                setCurrentUpvotes(currentUpvotes - 1);
                setUserVote(null);
            } else {
                setCurrentUpvotes(currentUpvotes + 1);
                if (userVote === "down") {
                    setCurrentDownvotes(currentDownvotes - 1);
                }
                setUserVote("up");
            }
        } else {
            // type === "down"
            if (userVote === "down") {
                // User un-downvoted
                setCurrentDownvotes(currentDownvotes - 1);
                setUserVote(null);
            } else {
                setCurrentDownvotes(currentDownvotes + 1);
                if (userVote === "up") {
                    setCurrentUpvotes(currentUpvotes - 1);
                }
                setUserVote("down");
            }
        }
        console.log(`User ${user.email} voted ${type} on post ${post.id}`);
        // In a real app, this would update vote counts in backend
    };

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

    const handleViewComments = () => {
        alert(`Viewing all ${commentsCount} comments for "${post.title}"`);
        // In a real app, this would navigate to a comments page
    };

    console.log(user);

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
                    <Button
                        onClick={handleCommentSubmit}
                        disabled={!user || !commentText.trim()}
                    >
                        Comment
                    </Button>
                </div>
                {/* Button to view all comments */}
                <Button
                    variant="link"
                    onClick={handleViewComments}
                    className="text-sm p-0 h-auto"
                >
                    View all {commentsCount} comments
                </Button>
            </div>
        </div>
    );
}
