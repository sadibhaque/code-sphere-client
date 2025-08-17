import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock, TrendingUp, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import PostCard from "../../components/PostCard";
import axios from "axios/unsafe/axios.js";
import { useQuery } from "@tanstack/react-query";

export default function PostList() {
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    // const [posts, setPosts] = useState([]);

    const { data: posts = [] } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axios.get(
                "https://code-sphere-server-nu.vercel.app/posts"
            );
            return response.data;
        },
    });

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "newest") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        } else {
            // Popular sorting: (upvotes - downvotes) in descending order
            const aScore = (a.upvotes || 0) - (a.downvotes || 0);
            const bScore = (b.upvotes || 0) - (b.downvotes || 0);
            return bScore - aScore;
        }
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section id="posts" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="border-0 shadow-xl bg-accent relative overflow-hidden">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-3xl font-bold text-gradient mb-2">
                                    Latest Discussions
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Join the conversation and share your
                                    insights
                                </p>
                            </div>

                            <div className="flex items-center gap-2 p-1 bg-background rounded-xl">
                                <Button
                                    variant={
                                        sortBy === "newest"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                    className={cn(
                                        "transition-all-smooth rounded-lg",
                                        sortBy === "newest"
                                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                                            : "hover:bg-background/50"
                                    )}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Newest
                                </Button>
                                <Button
                                    variant={
                                        sortBy === "popularity"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setSortBy("popularity")}
                                    className={cn(
                                        "transition-all-smooth rounded-lg",
                                        sortBy === "popularity"
                                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                                            : "hover:bg-background/50"
                                    )}
                                >
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Popular
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {currentPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="stagger-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <PostCard post={post} />
                            </div>
                        ))}

                        {currentPosts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Filter className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    No posts found
                                </h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your filters or check back
                                    later.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center animate-fade-in">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            paginate(
                                                Math.max(1, currentPage - 1)
                                            );
                                        }}
                                        className={cn(
                                            "transition-all-smooth hover:scale-105",
                                            currentPage === 1 &&
                                                "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                paginate(i + 1);
                                            }}
                                            className="transition-all-smooth hover:scale-105"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            paginate(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1
                                                )
                                            );
                                        }}
                                        className={cn(
                                            "transition-all-smooth hover:scale-105",
                                            currentPage === totalPages &&
                                                "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </section>
    );
}
