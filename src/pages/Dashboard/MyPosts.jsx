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
