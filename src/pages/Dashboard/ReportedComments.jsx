import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import Loading from "@/components/Loading";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";

export default function ReportedComments() {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10; // 10 comments per page for pagination
    const [comments, setComments] = useState([]);
    const [loadingActions, setLoadingActions] = useState({});

    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    // Redirect non-admin users to user dashboard
    useEffect(() => {
        if (userHook?.role && userHook.role !== "admin") {
            navigate("/dashboard/user", { replace: true });
        }
    }, [userHook, navigate]);

    const { data: queriedComments = [], isLoading } = useQuery({
        queryKey: ["reportedComments"],
        queryFn: () =>
            axios
                .get("http://localhost:3000/get-reports")
                .then((res) => res.data),
    });

    useEffect(() => {
        setComments(queriedComments);
    }, [queriedComments]);

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(
        indexOfFirstComment,
        indexOfLastComment
    );
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAction = async (comment, action) => {
        console.log(comment.commentId, comment._id);
        try {
            // Set loading state for this specific comment action
            setLoadingActions((prev) => ({
                ...prev,
                [comment._id + action]: true,
            }));

            if (action === "Delete") {
                // Call API to delete the comment and update status to "deleted"
                // await axios.delete(
                //     `http://localhost:3000/comment-delete/${comment.commentId}`
                // );
                await axios.patch(
                    `http://localhost:3000/comment-status/${comment._id}`,
                    {
                        status: "deleted",
                    }
                );

                toast.success("Comment has been deleted successfully!");
            } else if (action === "Dismiss") {
                // Call API to update status to "dismissed"
                await axios.patch(
                    `http://localhost:3000/comment-status/${comment._id}`,
                    {
                        status: "dismissed",
                    }
                );

                toast.success("Report has been dismissed successfully!");
            }

            // Reset to page 1 if current page becomes empty
            if (currentComments.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error(`Error during ${action} action:`, error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                `Failed to ${action.toLowerCase()} the comment`;
            toast.error(errorMessage);
        } finally {
            // Clear loading state for this action
            setLoadingActions((prev) => ({
                ...prev,
                [comment._id + action]: false,
            }));
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Reported Comments
                </h1>
                <p className="text-muted-foreground">
                    Review and manage reported comments
                </p>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loading />
                </div>
            ) : (
                <div className="w-full max-w-[400px] md:max-w-full lg:max-w-full overflow-x-scroll lg:overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px]">
                                    Commenter Email
                                </TableHead>
                                <TableHead className="min-w-[200px]">
                                    Comment Text
                                </TableHead>
                                <TableHead className="min-w-[120px]">
                                    Report Details
                                </TableHead>
                                <TableHead className="text-center min-w-[200px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentComments.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No reported comments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentComments.map((comment) => (
                                    <TableRow key={comment._id}>
                                        <TableCell className="font-medium">
                                            <div className="truncate max-w-[150px]">
                                                {comment.commenterEmail ||
                                                    comment.userEmail}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate">
                                                {comment.text}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl sm:text-2xl font-semibold">
                                                            Report Details
                                                        </DialogTitle>
                                                        <DialogDescription className="space-y-2">
                                                            <div>
                                                                <span className="font-semibold text-foreground">
                                                                    Report
                                                                    Reason:
                                                                </span>{" "}
                                                                {
                                                                    comment.feedbackType
                                                                }
                                                            </div>
                                                            {comment.reportFeedback && (
                                                                <div>
                                                                    <span className="font-semibold text-foreground">
                                                                        Details:
                                                                    </span>{" "}
                                                                    {
                                                                        comment.reportFeedback
                                                                    }
                                                                </div>
                                                            )}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                                    disabled={
                                                        loadingActions[
                                                            comment.commentId +
                                                                "Dismiss"
                                                        ] ||
                                                        comment.status ===
                                                            "dismissed" ||
                                                        comment.status ===
                                                            "deleted"
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            comment,
                                                            "Dismiss"
                                                        )
                                                    }
                                                >
                                                    {comment.status ===
                                                    "dismissed"
                                                        ? "Dismissed"
                                                        : loadingActions[
                                                              comment.commentId +
                                                                  "Dismiss"
                                                          ]
                                                        ? "Dismissing..."
                                                        : "Dismiss"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                                    disabled={
                                                        loadingActions[
                                                            comment.commentId +
                                                                "Delete"
                                                        ] ||
                                                        comment.status ===
                                                            "deleted" ||
                                                        comment.status ===
                                                            "dismissed"
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            comment,
                                                            "Delete"
                                                        )
                                                    }
                                                >
                                                    {comment.status ===
                                                    "deleted"
                                                        ? "Deleted"
                                                        : loadingActions[
                                                              comment.commentId +
                                                                  "Delete"
                                                          ]
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
            {!isLoading && comments.length > commentsPerPage && (
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
                                            Math.min(
                                                totalPages,
                                                currentPage + 1
                                            )
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
            )}
        </div>
    );
}
