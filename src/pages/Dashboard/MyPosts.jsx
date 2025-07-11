import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2 } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios/unsafe/axios.js";

// Dummy posts data
const dummyMyPosts = [
    {
        id: "1",
        title: "Getting Started with React Hooks",
        upvotes: 45,
        downvotes: 3,
    },
    {
        id: "2",
        title: "Understanding JavaScript Closures",
        upvotes: 32,
        downvotes: 1,
    },
    {
        id: "3",
        title: "CSS Grid vs Flexbox: When to Use What",
        upvotes: 28,
        downvotes: 2,
    },
    {
        id: "4",
        title: "Building RESTful APIs with Node.js",
        upvotes: 56,
        downvotes: 4,
    },
    {
        id: "5",
        title: "State Management in React Applications",
        upvotes: 41,
        downvotes: 2,
    },
    {
        id: "6",
        title: "Introduction to TypeScript for Beginners",
        upvotes: 38,
        downvotes: 5,
    },
    {
        id: "7",
        title: "Database Design Best Practices",
        upvotes: 29,
        downvotes: 1,
    },
    {
        id: "8",
        title: "Responsive Web Design Techniques",
        upvotes: 33,
        downvotes: 3,
    },
    {
        id: "9",
        title: "Modern JavaScript ES6+ Features",
        upvotes: 42,
        downvotes: 2,
    },
    {
        id: "10",
        title: "Git and GitHub Workflow Guide",
        upvotes: 35,
        downvotes: 1,
    },
    {
        id: "11",
        title: "Performance Optimization in React",
        upvotes: 48,
        downvotes: 3,
    },
    {
        id: "12",
        title: "Understanding Async/Await in JavaScript",
        upvotes: 39,
        downvotes: 2,
    },
];

export default function MyPosts() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // 10 posts per page as per challenge task
    
    const totalVotes = (post) => post.upvotes - post.downvotes;
    
    const [posts, setPosts] = useState([]);
        useEffect(() => {
            axios.get("http://localhost:3000/posts").then((response) => {
                setPosts(response.data);
            });
        }, []);

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        alert(
            `Post "${
                posts.find((p) => p.id === postId)?.title
            }" deleted successfully!`
        );

        // Reset to page 1 if current page becomes empty
        if (currentPosts.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleViewComments = (postId) => {
        alert(`Viewing comments for post ID: ${postId}`);
        // In a real app, this would navigate to the comments page
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Post Title</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentPosts.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center py-4 text-muted-foreground"
                            >
                                No posts found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">
                                    {post.title}
                                </TableCell>
                                <TableCell>{totalVotes(post)}</TableCell>
                                <TableCell className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleViewComments(post.id)
                                        }
                                    >
                                        <MessageCircle className="h-4 w-4 mr-1" />{" "}
                                        Comments
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />{" "}
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    paginate(Math.max(1, currentPage - 1));
                                }}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
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
                                        Math.min(totalPages, currentPage + 1)
                                    );
                                }}
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
