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
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function MyPosts() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // 10 posts per page as per challenge task
    const { user } = useAuth();

    const totalVotes = (post) => {
        const upvotes = post?.upvotes || 0;
        const downvotes = post?.downvotes || 0;
        return upvotes - downvotes;
    };

    const { data: postsData = [] } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            axios
                .get(
                    `https://code-sphere-server-nu.vercel.app/posts/user-posts/${user?.email}`
                )
                .then((res) => res.data),
    });
    const [posts, setPosts] = useState(postsData);

    useEffect(() => {
        setPosts(postsData);
    }, [postsData]);

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
        );
        alert(
            `Post "${
                posts.find((p) => p._id === postId)?.title
            }" deleted successfully!`
        );

        // Reset to page 1 if current page becomes empty
        if (currentPosts.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="w-full max-w-[400px] md:max-w-full lg:max-w-full space-y-4">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-sm sm:text-base min-w-[200px]">
                                Post Title
                            </TableHead>
                            <TableHead className="text-sm sm:text-base min-w-[80px]">
                                Votes
                            </TableHead>
                            <TableHead className="text-center text-sm sm:text-base min-w-[150px]">
                                Actions
                            </TableHead>
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
                                <TableRow key={post._id}>
                                    <TableCell className="font-medium text-sm sm:text-base">
                                        <div
                                            className="max-w-[200px] truncate"
                                            title={post.title}
                                        >
                                            {post.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm sm:text-base">
                                        {totalVotes(post)}
                                    </TableCell>
                                    <TableCell className="space-y-2 sm:space-y-0 sm:flex sm:justify-center sm:gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mr-2 sm:w-auto"
                                        >
                                            <MessageCircle className="h-4 w-4 mr-1" />{" "}
                                            <Link
                                                to={`/dashboard/user-comments/${post._id}`}
                                                className="text-xs sm:text-sm"
                                            >
                                                Comments
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(post._id)
                                            }
                                            className="w-full sm:w-auto"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />{" "}
                                            <span className="text-xs sm:text-sm">
                                                Delete
                                            </span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
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
