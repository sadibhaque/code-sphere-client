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

// Dummy reported comments data
const dummyReportedComments = [
    {
        id: "1",
        postId: "1",
        commenterEmail: "user1@example.com",
        commentText:
            "This is a very inappropriate comment that was reported by users.",
        feedback: "Inappropriate content",
        reported: true,
    },
    {
        id: "2",
        postId: "2",
        commenterEmail: "user2@example.com",
        commentText:
            "Spam content with lots of promotional links and unwanted content.",
        feedback: "Spam content",
        reported: true,
    },
    {
        id: "3",
        postId: "1",
        commenterEmail: "user3@example.com",
        commentText:
            "Offensive language and personal attacks against other users.",
        feedback: "Offensive language",
        reported: true,
    },
    {
        id: "4",
        postId: "3",
        commenterEmail: "user4@example.com",
        commentText:
            "This comment contains misleading information and false claims.",
        feedback: "Misinformation",
        reported: true,
    },
    {
        id: "5",
        postId: "2",
        commenterEmail: "user5@example.com",
        commentText:
            "Harassment and bullying behavior towards other community members.",
        feedback: "Harassment",
        reported: true,
    },
    {
        id: "6",
        postId: "4",
        commenterEmail: "user6@example.com",
        commentText:
            "Copyright violation with copied content from other sources.",
        feedback: "Copyright violation",
        reported: true,
    },
    {
        id: "7",
        postId: "3",
        commenterEmail: "user7@example.com",
        commentText:
            "Hate speech and discriminatory content that violates community guidelines.",
        feedback: "Hate speech",
        reported: true,
    },
    {
        id: "8",
        postId: "5",
        commenterEmail: "user8@example.com",
        commentText:
            "Off-topic discussion and irrelevant content not related to the post.",
        feedback: "Off-topic",
        reported: true,
    },
    {
        id: "9",
        postId: "4",
        commenterEmail: "user9@example.com",
        commentText:
            "Personal information sharing without consent and privacy violations.",
        feedback: "Privacy violation",
        reported: true,
    },
    {
        id: "10",
        postId: "6",
        commenterEmail: "user10@example.com",
        commentText:
            "Duplicate comment posted multiple times to flood the discussion.",
        feedback: "Duplicate content",
        reported: true,
    },
    {
        id: "11",
        postId: "5",
        commenterEmail: "user11@example.com",
        commentText:
            "Inappropriate promotional content and self-advertising without permission.",
        feedback: "Unauthorized promotion",
        reported: true,
    },
    {
        id: "12",
        postId: "7",
        commenterEmail: "user12@example.com",
        commentText:
            "Trolling behavior and intentional disruption of meaningful discussions.",
        feedback: "Trolling",
        reported: true,
    },
];

export default function ReportedComments() {
    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState([]);
    const commentsPerPage = 10; // 10 comments per page for pagination

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(
        indexOfFirstComment,
        indexOfLastComment
    );
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        axios
            .get("http://localhost:3000/get-reports")
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching reported comments:", error);
            });
    }, []);

    const handleAction = (commentId, action) => {
        if (action === "Delete") {
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
            alert(`Comment ${commentId} has been deleted!`);
        } else if (action === "Dismiss") {
            setComments((prevComments) =>
                prevComments
                    .map((comment) =>
                        comment.id === commentId
                            ? { ...comment, reported: false }
                            : comment
                    )
                    .filter((comment) => comment.reported)
            );
            alert(`Report for comment ${commentId} has been dismissed!`);
        }

        // Reset to page 1 if current page becomes empty
        if (currentComments.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Commenter Email</TableHead>
                        <TableHead>Comment Text</TableHead>
                        <TableHead>Report Feedback</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentComments.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-4 text-muted-foreground"
                            >
                                No reported comments found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentComments.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell className="font-medium">
                                    {comment.commenterEmail}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {comment.reportFeedback}
                                </TableCell>
                                <TableCell>{comment.feedback}</TableCell>
                                <TableCell className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleAction(comment.id, "Dismiss")
                                        }
                                    >
                                        Dismiss Report
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            handleAction(comment.id, "Delete")
                                        }
                                    >
                                        Delete Comment
                                    </Button>
                                    {/* Add more admin actions as needed */}
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
