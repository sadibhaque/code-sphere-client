import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Clock,
    ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function PostCard({ post }) {
    const [isHovered, setIsHovered] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    useEffect(() => {
        async function fetchComments() {
            const response = await axios.get(
                `https://code-sphere-server-nu.vercel.app/comments/${post._id}`
            );
            setCommentsCount(response.data.length);
        }
        fetchComments();
    }, [post]);

    return (
        <Card
            className="max-w-[350px] md:max-w-[600px] lg:max-w-full mx-auto border-0 shadow-lg bg-accent transition-all-smooth hover-lift overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-background shadow-md transition-transform hover:scale-105 flex-shrink-0">
                        <AvatarImage
                            src={post?.authorImage || "/placeholder.svg"}
                            alt={post?.authorName || "Author"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                            {post?.authorName ? post.authorName.charAt(0) : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                            {post?.authorName || "Unknown Author"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                                {post?.createdAt
                                    ? new Date(post.createdAt).toLocaleString(
                                          "en-US",
                                          {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                          }
                                      )
                                    : "Unknown time"}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <Link
                    to={`/post-details/${post?._id || ""}`}
                    className="block group"
                >
                    <h3
                        className={cn(
                            "text-xl font-bold mb-3 line-clamp-2 transition-all-smooth",
                            "group-hover:text-primary group-hover:translate-x-1"
                        )}
                    >
                        {post?.title || "Untitled Post"}
                        <ArrowRight
                            className={cn(
                                "inline-block ml-2 h-5 w-5 transition-all-smooth",
                                isHovered
                                    ? "opacity-100 translate-x-1"
                                    : "opacity-0"
                            )}
                        />
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {post?.content || "No content available"}
                    </p>
                </Link>

                <div className="flex flex-wrap gap-2 max-w-full">
                    {post.tagList.slice(0, 3).map((tag, index) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full transition-all-smooth hover:scale-105 max-w-[120px] truncate",
                                "bg-gradient-to-r from-muted to-muted/80 hover:from-primary/10 hover:to-primary/5",
                                "border border-border hover:border-primary/30"
                            )}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            #{tag}
                        </Badge>
                    ))}
                    {post.tagList.length > 3 && (
                        <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs truncate"
                        >
                            +{post.tagList.length - 3} more
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground w-full sm:w-auto">
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                        <div className="p-1.5 rounded-full bg-muted/50">
                            <MessageCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{commentsCount}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-green-600 transition-colors">
                        <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-950">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">
                            {post?.upvotes || 0}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-red-600 transition-colors">
                        <div className="p-1.5 rounded-full bg-red-50 dark:bg-red-950">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">
                            {post?.downvotes || 0}
                        </span>
                    </div>
                </div>

                <Link
                    to={`/post-details/${post?._id || ""}`}
                    className="w-full sm:w-auto"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10 transition-all-smooth hover:scale-105 font-medium w-full sm:w-auto"
                    >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
