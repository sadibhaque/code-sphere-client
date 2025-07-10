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

const posts = [
    {
        id: "1",
        authorImage: "/placeholder-user.jpg",
        authorName: "Alice Johnson",
        title: "Getting Started with Next.js 14",
        description:
            "A comprehensive guide to setting up your first Next.js 14 project with App Router.",
        tags: ["Next.js", "React", "Web Development"],
        time: "2 hours ago",
        commentsCount: 15,
        upvotes: 120,
        downvotes: 5,
    },
    {
        id: "2",
        authorImage: "/placeholder-user.jpg",
        authorName: "Bob Williams",
        title: "Understanding Tailwind CSS Utility Classes",
        description:
            "Dive deep into the power of Tailwind CSS and how to effectively use its utility-first approach.",
        tags: ["Tailwind CSS", "CSS", "Styling"],
        time: "1 day ago",
        commentsCount: 8,
        upvotes: 90,
        downvotes: 2,
    },
    {
        id: "3",
        authorImage: "/placeholder-user.jpg",
        authorName: "Charlie Brown",
        title: "State Management in React: A Comparison",
        description:
            "Exploring different state management solutions like Context API, Redux, Zustand, and Jotai.",
        tags: ["React", "State Management", "JavaScript"],
        time: "3 days ago",
        commentsCount: 22,
        upvotes: 150,
        downvotes: 10,
    },
    {
        id: "4",
        authorImage: "/placeholder-user.jpg",
        authorName: "Diana Prince",
        title: "Building RESTful APIs with Node.js and Express",
        description:
            "A step-by-step tutorial on creating robust RESTful APIs using Node.js and the Express framework.",
        tags: ["Node.js", "Express.js", "API"],
        time: "5 days ago",
        commentsCount: 10,
        upvotes: 75,
        downvotes: 3,
    },
    {
        id: "5",
        authorImage: "/placeholder-user.jpg",
        authorName: "Eve Adams",
        title: "Database Design Best Practices for Scalable Applications",
        description:
            "Tips and tricks for designing efficient and scalable databases for your web applications.",
        tags: ["Database", "MongoDB", "SQL"],
        time: "1 week ago",
        commentsCount: 5,
        upvotes: 60,
        downvotes: 1,
    },
    {
        id: "6",
        authorImage: "/placeholder-user.jpg",
        authorName: "Frank White",
        title: "Introduction to Serverless Functions with Vercel",
        description:
            "Learn how to deploy serverless functions on Vercel for backend logic without managing servers.",
        tags: ["Serverless", "Vercel", "Cloud"],
        time: "1 week ago",
        commentsCount: 18,
        upvotes: 110,
        downvotes: 4,
    },
    {
        id: "7",
        authorImage: "/placeholder-user.jpg",
        authorName: "Grace Lee",
        title: "Optimizing React Performance: A Deep Dive",
        description:
            "Techniques and tools to identify and fix performance bottlenecks in your React applications.",
        tags: ["React", "Performance", "Optimization"],
        time: "2 weeks ago",
        commentsCount: 9,
        upvotes: 85,
        downvotes: 0,
    },
    {
        id: "8",
        authorImage: "/placeholder-user.jpg",
        authorName: "Henry Green",
        title: "Securing Your Web Applications: Common Vulnerabilities",
        description:
            "An overview of common web security vulnerabilities and how to protect your applications.",
        tags: ["Security", "Web Development", "Best Practices"],
        time: "2 weeks ago",
        commentsCount: 12,
        upvotes: 95,
        downvotes: 6,
    },
    {
        id: "9",
        authorImage: "/placeholder-user.jpg",
        authorName: "Ivy King",
        title: "Responsive Design with CSS Grid and Flexbox",
        description:
            "Mastering modern CSS layout techniques for building responsive and adaptive user interfaces.",
        tags: ["CSS", "Responsive Design", "Frontend"],
        time: "3 weeks ago",
        commentsCount: 7,
        upvotes: 70,
        downvotes: 1,
    },
    {
        id: "10",
        authorImage: "/placeholder-user.jpg",
        authorName: "Jack Black",
        title: "Introduction to GraphQL for Frontend Developers",
        description:
            "A beginner-friendly guide to understanding and using GraphQL in your frontend projects.",
        tags: ["GraphQL", "API", "Frontend"],
        time: "1 month ago",
        commentsCount: 11,
        upvotes: 100,
        downvotes: 3,
    },
];

export default function PostList() {
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        } else {
            return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        }
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="w-full py-12 animate-fade-in">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="border-0 shadow-xl ">
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

                            <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl">
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
