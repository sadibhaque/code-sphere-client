import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function AdminDashboard() {
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);
    const [tagsId, setTagsId] = useState("");

    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    // Redirect non-admin users to user dashboard
    useEffect(() => {
        if (userHook?.role && userHook.role !== "admin") {
            navigate("/dashboard/user", { replace: true });
        }
    }, [userHook, navigate]);

    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useQuery({
        queryKey: ["postCount"],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:3000/posts-count"
            );
            setPostCount(response.data.totalPosts);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["usersCount"],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:3000/users-count"
            );
            setUserCount(response.data.totalUsers);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["commentsCount"],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:3000/comments-count"
            );
            setCommentCount(response.data.totalComments);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            try {
                const response = await axios.get("http://localhost:3000/tags");
                let fetchedTags = [];

                if (response.data && response.data.length > 0) {
                    // Check if tagList is a string that needs to be parsed
                    if (typeof response.data[0]?.tagList === "string") {
                        try {
                            fetchedTags = JSON.parse(response.data[0].tagList);
                        } catch (parseError) {
                            console.error("Error parsing tagList:", parseError);
                            fetchedTags = [];
                        }
                    } else if (Array.isArray(response.data[0]?.tagList)) {
                        // If it's already an array, use it directly
                        fetchedTags = response.data[0].tagList;
                    }

                    setTagsId(response.data[0]?._id);
                }

                setTags(fetchedTags);
                return response.data;
            } catch (error) {
                console.error("Error fetching tags:", error);
                toast.error("Failed to load tags");
                return [];
            }
        },
    });

    // data for pie chart
    const chartData = [
        { name: "Total Posts", value: postCount },
        { name: "Total Comments", value: commentCount },
        { name: "Total Users", value: userCount },
    ];

    const validateTag = (tagValue) => {
        if (!tagValue || tagValue.trim().length < 2) {
            return "Tag name must be at least 2 characters.";
        }
        if (tags.includes(tagValue.trim())) {
            return "Tag already exists.";
        }
        return null;
    };

    const onAddTag = async (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        const error = validateTag(trimmedTag);

        if (error) {
            setErrors({ newTag: error });
            return;
        }

        // Update the local state first for immediate UI feedback
        const updatedTags = [...tags, trimmedTag];
        setTags(updatedTags);
        setNewTag("");

        try {
            if (!tagsId) {
                toast.error("Cannot update tags: Tag document ID not found");
                return;
            }

            // Send update to the server
            await axios.put(`http://localhost:3000/tags/${tagsId}`, {
                tagList: updatedTags,
            });

            toast.success(`Tag "${trimmedTag}" added successfully!`);
            setErrors({});
        } catch (error) {
            console.error("Error updating tags:", error);
            toast.error("Failed to save tag. Please try again.");
            // Rollback the local state on error
            setTags(tags);
        }
    };

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        Admin Profile
                    </CardTitle>
                    <CardDescription>
                        Overview of your admin account and site statistics.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                            <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                                <AvatarImage
                                    src={user.image || "/placeholder-user.jpg"}
                                    alt={user.displayName}
                                />
                                <AvatarFallback className="text-2xl sm:text-4xl">
                                    {user.displayName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left space-y-1">
                                <p className="text-xl sm:text-2xl font-bold break-words">
                                    {user.displayName}
                                </p>
                                <p className="text-muted-foreground text-sm sm:text-base break-all">
                                    {user.email}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                                    Total Posts: {postCount} | Total Comments:{" "}
                                    {commentCount} | Total Users: {userCount}
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-80 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Tag</CardTitle>
                    <CardDescription>
                        Add new tags that users can select for their posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onAddTag} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newTag">Tag Name</Label>
                            <Input
                                id="newTag"
                                type="text"
                                placeholder="e.g., AI, Blockchain"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="w-full"
                            />
                            {errors.newTag && (
                                <p className="text-red-500 text-sm">
                                    {errors.newTag}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Add Tag
                        </Button>
                    </form>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Existing Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
