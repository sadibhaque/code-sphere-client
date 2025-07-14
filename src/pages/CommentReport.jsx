import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoaderData, useNavigate } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import axios from "axios/unsafe/axios.js";

const CommentReport = () => {
    const comment = useLoaderData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const reportFeedback = e.target.reportFeedback.value.trim();

        const data = {
            commentId: comment._id,
            reportFeedback: reportFeedback,
            postId: comment.postId,
            reporterId: user._id,
            reporterName: user.displayName,
            commenterId: comment.userId,
            commenterName: comment.userName,
        };

        axios
            .post("http://localhost:3000/reports", data)
            .then(() => {
                e.target.reset();
                toast.success("Report submitted successfully!");

                navigate(`/post-details/${comment.postId}`);
            })
            .catch(() => {
                toast.error("Failed to submit report.");
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
                                <Label htmlFor="reportFeedback">
                                    Report Feedback
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
