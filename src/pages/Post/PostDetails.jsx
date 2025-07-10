import { useState } from "react";
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

// Dummy post data
const dummyPost = {
    id: "1",
    authorImage: "/placeholder-user.jpg",
    authorName: "Alice Johnson",
    title: "Getting Started with React Hooks: A Comprehensive Guide",
    description: `React Hooks have revolutionized the way we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and how they can simplify your React development workflow.

## What are React Hooks?

React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have since become the preferred way to write React components.

## Key Benefits:

1. **Simpler Code**: No need for class components in most cases
2. **Better Code Reuse**: Custom hooks allow you to share stateful logic
3. **Easier Testing**: Functional components are generally easier to test
4. **Better Performance**: Hooks can help optimize re-renders

## Most Common Hooks:

- useState: For managing component state
- useEffect: For side effects and lifecycle methods
- useContext: For consuming React context
- useReducer: For complex state management
- useMemo: For memoizing expensive calculations
- useCallback: For memoizing functions

Let's dive into each of these hooks with practical examples and best practices!`,
    tags: ["React", "JavaScript", "Hooks", "Frontend", "Web Development"],
    time: "2 hours ago",
    commentsCount: 24,
    upvotes: 156,
    downvotes: 8,
};

// Dummy user data
const dummyUser = {
    isLoggedIn: true,
    email: "user@example.com",
    name: "Current User",
};

export default function PostDetail() {
    const [post] = useState(dummyPost);
    const [user] = useState(dummyUser);
    const [commentText, setCommentText] = useState("");
    const [currentUpvotes, setCurrentUpvotes] = useState(post.upvotes);
    const [currentDownvotes, setCurrentDownvotes] = useState(post.downvotes);
    const [userVote, setUserVote] = useState(null); // Tracks user's vote for this post
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);

    const handleCommentSubmit = () => {
        if (!user?.isLoggedIn) {
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
        if (!user?.isLoggedIn) {
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

    return (
        <div className="max-w-4xl mx-auto my-10">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={post.authorImage || "/placeholder.svg"}
                                alt={post.authorName}
                            />
                            <AvatarFallback>
                                {post.authorName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-lg">
                                {post.authorName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {post.time}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-3xl font-bold mb-4">
                        {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground whitespace-pre-wrap mb-6">
                        {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
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
                            disabled={!user?.isLoggedIn}
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
                            disabled={!user?.isLoggedIn}
                        >
                            <ThumbsDown className="h-5 w-5 mr-1" />{" "}
                            {currentDownvotes}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={!user?.isLoggedIn}
                        >
                            <MessageCircle className="h-5 w-5 mr-1" />{" "}
                            {commentsCount}
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!user?.isLoggedIn}
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
                        disabled={!user?.isLoggedIn}
                    />
                    <Button
                        onClick={handleCommentSubmit}
                        disabled={!user?.isLoggedIn || !commentText.trim()}
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
