import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CommentReport = () => {
    const comment = useLoaderData();
    console.log(comment);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [feedbackType, setFeedbackType] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const reportFeedback = e.target.reportFeedback.value.trim();

        if (!feedbackType) {
            toast.error("Please select a feedback type");
            return;
        }

        const data = {
            commentId: comment._id,
            reportFeedback: reportFeedback,
            feedbackType: feedbackType,
            postId: comment.postId,
            reporterId: user._id,
            reporterName: user.displayName,
            commenterId: comment.userId,
            commenterEmail: comment.userEmail,
            commenterName: comment.userName,
            status: "pending",
        };

        axios
            .post("http://localhost:3000/reports", data)
            .then(() => {
                e.target.reset();
                toast.success("Report submitted successfully!");
                navigate(`/post-details/${comment.postId}`);
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
        <div>
            <Card className="w-full mx-auto my-10 max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Report Comment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Select
                                    onValueChange={(value) =>
                                        setFeedbackType(value)
                                    }
                                    value={feedbackType}
                                    required
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Feedback" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="harassment">
                                                Harassment
                                            </SelectItem>
                                            <SelectItem value="inappropriate">
                                                Inappropriate
                                            </SelectItem>
                                            <SelectItem value="threat">
                                                Threat
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Label htmlFor="reportFeedback">
                                    Report Details
                                </Label>
                                <Textarea
                                    className="h-60"
                                    id="reportFeedback"
                                    type="text"
                                    placeholder="Enter your feedback"
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Please provide honest feedback. Do not submit
                                false accusations.
                            </p>
                        </div>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                Submit Report
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommentReport;
