import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { useLoaderData } from "react-router";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ReportFeedbackOptions = [
    "Spam or misleading",
    "Hate speech or harassment",
    "Inappropriate content",
    "Off-topic",
    "Violates community guidelines",
];

export default function MyComments() {
    const { user } = useAuth();
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;
    const [comments, setComments] = useState([]);
    const id = useLoaderData();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        async function fetchComments() {
            const response = await axiosSecure.get(`/comments/${id}`);
            setComments(response.data);
        }
        fetchComments();
    }, [id]);

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments?.slice(
        indexOfFirstComment,
        indexOfLastComment
    );
    const totalPages = Math.ceil(comments?.length / commentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleReport = (comment) => {
        const data = {
            commentId: comment._id,
            text: comment.text,
            feedbackType: selectedFeedback[comment.id],
            postId: comment.postId,
            reporterName: user?.displayName,
            postTitle: comment.postTitle,
            commenterId: comment.userId,
            commenterEmail: comment.userEmail,
            commenterName: comment.userName,
            status: "pending",
        };
        console.log(comment);
        axios
            .post("http://localhost:3000/reports", data)
            .then(() => {
                toast.success("Report submitted successfully!");
                // Clear the selected feedback for this comment after successful report
                setSelectedFeedback((prev) => ({
                    ...prev,
                    [comment.id]: null,
                }));
            })
            .catch((error) => {
                console.error("Error submitting report:", error);
                toast.error(
                    "Failed to submit report: " +
                        (error.response?.data?.message || "Unknown error")
                );
            });
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    My Comments
                </h1>
                <p className="text-muted-foreground">
                    View and manage comments on your posts
                </p>
            </div>
            <div className="w-full overflow-x-auto">
                <Table className="lg:min-w-[700px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px] text-sm sm:text-base">
                                Commenter Email
                            </TableHead>
                            <TableHead className="min-w-[200px] text-sm sm:text-base">
                                Comment
                            </TableHead>
                            <TableHead className="min-w-[180px] text-sm sm:text-base">
                                Feedback
                            </TableHead>
                            <TableHead className="text-center min-w-[100px] text-sm sm:text-base">
                                Report
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentComments?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-muted-foreground text-sm sm:text-base"
                                >
                                    No comments found for this post.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentComments?.map((comment) => (
                                <TableRow key={comment.id}>
                                    <TableCell className="font-medium text-sm sm:text-base">
                                        <div className="truncate max-w-[150px]">
                                            {comment.userEmail}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm sm:text-base">
                                        <div className="max-w-[200px]">
                                            {comment.text?.length > 20 ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <span className="cursor-pointer text-primary hover:underline">
                                                            {comment.text.substring(
                                                                0,
                                                                20
                                                            )}
                                                            ... Read More
                                                        </span>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Full Comment
                                                            </DialogTitle>
                                                            <DialogDescription className="break-words">
                                                                {comment.text}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <span className="break-words">
                                                    {comment.text}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full max-w-[160px] text-xs sm:text-sm truncate"
                                                >
                                                    {selectedFeedback[
                                                        comment.id
                                                    ] || "Select feedback"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                {ReportFeedbackOptions?.map(
                                                    (option) => (
                                                        <DropdownMenuItem
                                                            key={option}
                                                            onClick={() =>
                                                                setSelectedFeedback(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [comment.id]:
                                                                            option,
                                                                    })
                                                                )
                                                            }
                                                            className="text-sm"
                                                        >
                                                            {option}
                                                        </DropdownMenuItem>
                                                    )
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="text-xs sm:text-sm"
                                            onClick={() => {
                                                handleReport(comment);
                                            }}
                                            disabled={
                                                !selectedFeedback[comment.id]
                                            }
                                        >
                                            Report
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
                                onClick={() =>
                                    paginate(Math.max(1, currentPage - 1))
                                }
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
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    paginate(
                                        Math.min(totalPages, currentPage + 1)
                                    )
                                }
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
